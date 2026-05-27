<<<<<<< HEAD
"""
pdf_utils.py — Multi-layer PDF extraction
Handles: plain text, numbers, symbols, tables, and scanned (image-based) PDFs
Dependencies: pdfplumber, pymupdf (fitz), pytesseract, pdf2image, Pillow
Install: pip install pdfplumber pymupdf pytesseract pdf2image Pillow
Also install: tesseract-ocr (system package — see README)
"""

import pdfplumber
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import io
import re
import os
import tempfile


# ── helpers ───────────────────────────────────────────────────────────────────

def _is_scanned_page(page_fitz) -> bool:
    """Return True if a PyMuPDF page has no extractable text (likely a scan)."""
    text = page_fitz.get_text("text").strip()
    return len(text) < 20  # fewer than 20 chars → treat as image


def _clean_text(text: str) -> str:
    """
    Normalize extracted text:
    - Collapse excessive whitespace / blank lines
    - Preserve numbers, symbols (₹, $, %, °, ±, ∑, etc.)
    - Strip control characters but keep printable Unicode
    """
    if not text:
        return ""
    # Remove null bytes and other control chars (keep newlines/tabs)
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)
    # Collapse 3+ blank lines into 2
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Collapse horizontal whitespace runs (but not newlines)
    text = re.sub(r"[^\S\n]+", " ", text)
    return text.strip()


def _table_to_text(table: list) -> str:
    """Convert a pdfplumber table (list of rows) to a readable string."""
    if not table:
        return ""
    lines = []
    for row in table:
        # Replace None cells with empty string
        cells = [str(cell).strip() if cell is not None else "" for cell in row]
        lines.append(" | ".join(cells))
    return "\n".join(lines)


# ── per-page extraction ───────────────────────────────────────────────────────

def _extract_page_text_and_tables(plumber_page) -> str:
    """
    Extract text + tables from a pdfplumber page.
    Tables are converted to pipe-separated rows and inserted in reading order.
    Numbers, currency symbols, math symbols, etc. are preserved as-is.
    """
    parts = []

    # 1. Extract tables first so we know their bounding boxes
    tables = plumber_page.extract_tables()
    table_texts = [_table_to_text(t) for t in tables if t]

    # 2. Extract plain text (pdfplumber preserves layout better than pypdf)
    raw_text = plumber_page.extract_text(x_tolerance=3, y_tolerance=3) or ""

    if raw_text:
        parts.append(raw_text)

    # 3. Append table blocks (deduplication: pdfplumber text already contains
    #    some table content, but structured version is more useful for numbers)
    if table_texts:
        parts.append("\n[TABLE]\n" + "\n\n[TABLE]\n".join(table_texts))

    return _clean_text("\n".join(parts))


def _ocr_page_image(pil_image: Image.Image) -> str:
    """Run Tesseract OCR on a PIL image and return cleaned text."""
    # Config: OEM 3 (LSTM), PSM 6 (uniform block of text)
    # whitelist is intentionally empty — we want ALL characters including symbols
    config = "--oem 3 --psm 6"
    text = pytesseract.image_to_string(pil_image, config=config)
    return _clean_text(text)


def _extract_embedded_images_text(fitz_page) -> str:
    """
    Extract text from images embedded inside a PDF page (e.g. scanned figures,
    tables saved as images). Uses PyMuPDF to get the image, then OCR.
    """
    ocr_parts = []
    for img_info in fitz_page.get_images(full=True):
        xref = img_info[0]
        base_image = fitz_page.parent.extract_image(xref)
        img_bytes = base_image.get("image")
        if not img_bytes:
            continue
        try:
            pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            # Skip tiny images (likely decorative icons)
            if pil_img.width < 80 or pil_img.height < 40:
                continue
            ocr_text = _ocr_page_image(pil_img)
            if ocr_text:
                ocr_parts.append(ocr_text)
        except Exception:
            pass
    return "\n".join(ocr_parts)


# ── main extraction ───────────────────────────────────────────────────────────

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Master extraction function. Returns a single string with all content:
    - Plain text (including numbers, symbols, special characters)
    - Tables (converted to readable rows)
    - OCR text from scanned pages or embedded images

    Raises FileNotFoundError if the PDF does not exist.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    all_pages: list[str] = []

    # Open with both libraries for complementary strengths
    fitz_doc = fitz.open(pdf_path)

    with pdfplumber.open(pdf_path) as plumber_doc:
        for page_num in range(min(20, len(plumber_doc.pages))):
            plumber_page = plumber_doc.pages[page_num]
            fitz_page = fitz_doc[page_num]

            page_parts: list[str] = []

            scanned = _is_scanned_page(fitz_page)

            if scanned:
                # ── Scanned page: OCR the whole page as an image ──────────
                # Render at 200 DPI for good OCR accuracy
                mat = fitz.Matrix(200 / 72, 200 / 72)
                clip = fitz_page.rect
                pix = fitz_page.get_pixmap(matrix=mat, clip=clip)
                img_bytes = pix.tobytes("png")
                pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
                ocr_text = _ocr_page_image(pil_img)
                if ocr_text:
                    page_parts.append(f"[Page {page_num + 1} — OCR]\n{ocr_text}")
            else:
                # ── Text-based page: extract text + tables ─────────────────
                text_and_tables = _extract_page_text_and_tables(plumber_page)
                if text_and_tables:
                    page_parts.append(f"[Page {page_num + 1}]\n{text_and_tables}")

                # Also OCR any embedded image blocks on this page
                embedded_ocr = _extract_embedded_images_text(fitz_page)
                if embedded_ocr:
                    page_parts.append(f"[Page {page_num + 1} — Embedded image text]\n{embedded_ocr}")

            if page_parts:
                all_pages.append("\n".join(page_parts))

    fitz_doc.close()

    full_text = "\n\n".join(all_pages)
    return full_text if full_text.strip() else ""


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Split extracted text into overlapping chunks for embedding/indexing.
    - chunk_size: target character count per chunk
    - overlap: characters shared between consecutive chunks (for context continuity)
    """
    if not text:
        return []

    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = start + chunk_size

        # Try to break at a sentence or paragraph boundary
        if end < text_len:
            # Look back up to 100 chars for a good break point
            break_chars = ["\n\n", "\n", ". ", "! ", "? "]
            for sep in break_chars:
                pos = text.rfind(sep, start + chunk_size // 2, end)
                if pos != -1:
                    end = pos + len(sep)
                    break

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end - overlap  # overlap for context continuity

=======
import pdfplumber


# Extract text from PDF
def extract_text(pdf_path):

    text = ""

    with pdfplumber.open(pdf_path) as pdf:

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text

    return text


# Split text into chunks
def chunk_text(text, chunk_size=500):

    words = text.split()

    chunks = []

    for i in range(0, len(words), chunk_size):

        chunk = " ".join(words[i:i + chunk_size])

        chunks.append(chunk)

>>>>>>> f49e9a07dfd6f01c2c3d2cd4fe7d5b1e4d8333ea
    return chunks