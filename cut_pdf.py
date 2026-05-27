"""
cut_pdf.py — Cut a PDF to a maximum file size (default 16MB)
Usage: python cut_pdf.py input.pdf
Output: input_cut.pdf (saved in same folder)
"""

import fitz  # PyMuPDF
import os
import sys


def cut_pdf_to_size(input_path: str, max_size_mb: float = 16.0) -> str:
    """
    Cut a PDF page by page until it fits within max_size_mb.
    Returns the output file path.
    """
    max_bytes = int(max_size_mb * 1024 * 1024)

    # Check if input file exists
    if not os.path.exists(input_path):
        print(f"❌ File not found: {input_path}")
        sys.exit(1)

    # Check original size
    original_size = os.path.getsize(input_path)
    original_mb = original_size / (1024 * 1024)
    print(f"📄 Original file: {os.path.basename(input_path)}")
    print(f"📦 Original size: {original_mb:.2f} MB")

    # If already under limit, no need to cut
    if original_size <= max_bytes:
        print(f"✅ File is already under {max_size_mb}MB — no cutting needed.")
        return input_path

    # Build output path
    base, ext = os.path.splitext(input_path)
    output_path = f"{base}_cut{ext}"

    # Open original PDF
    original_doc = fitz.open(input_path)
    total_pages = len(original_doc)
    print(f"📖 Total pages: {total_pages}")
    print(f"✂️  Cutting to fit under {max_size_mb}MB...\n")

    # Add pages one by one until size limit is reached
    new_doc = fitz.open()
    kept_pages = 0

    for page_num in range(total_pages):
        # Insert next page into new doc
        new_doc.insert_pdf(original_doc, from_page=page_num, to_page=page_num)

        # Save to a temp buffer to check size
        temp_bytes = new_doc.tobytes()
        current_size_mb = len(temp_bytes) / (1024 * 1024)

        if len(temp_bytes) > max_bytes:
            # This page pushed it over — remove it and stop
            new_doc.delete_page(new_doc.page_count - 1)
            print(f"⚠️  Stopped at page {page_num} — adding it exceeded {max_size_mb}MB")
            break

        kept_pages += 1
        print(f"  ✔ Page {page_num + 1} added — current size: {current_size_mb:.2f} MB")

    # Save output
    new_doc.save(output_path)
    new_doc.close()
    original_doc.close()

    # Final report
    final_size = os.path.getsize(output_path)
    final_mb = final_size / (1024 * 1024)
    print(f"\n✅ Done!")
    print(f"📄 Output file : {output_path}")
    print(f"📖 Pages kept  : {kept_pages} of {total_pages}")
    print(f"📦 Final size  : {final_mb:.2f} MB")

    return output_path


if __name__ == "__main__":
    # Get input file from command line or ask user
    if len(sys.argv) > 1:
        input_pdf = sys.argv[1]
    else:
        input_pdf = input("Enter the path to your PDF file: ").strip().strip('"')

    # Optional: change max size here
    MAX_SIZE_MB = 16.0

    cut_pdf_to_size(input_pdf, max_size_mb=MAX_SIZE_MB)