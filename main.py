<<<<<<< HEAD
import os
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from pdf_utils import extract_text_from_pdf, chunk_text
from rag import build_index, get_answer
from dotenv import load_dotenv
from flask_cors import CORS
import pytesseract

load_dotenv()

# ── Tesseract path (Windows) ───────────────────────────────────────────────
# If Tesseract is installed at a different location, update this path.
# On Linux/Mac this line is not needed (tesseract is on PATH automatically).
if os.name == "nt":  # Windows only
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ── App setup ──────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)  # Allow frontend (Vite) to talk to Flask

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER# 32MB
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024

# 50MB
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024

# 100MB
app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

current_file: dict = {}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ── Routes ─────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    try:
        file.save(filepath)
    except Exception as e:
        return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

    # ── Extract text (supports plain text, tables, symbols, scanned pages) ──
    try:
        text = extract_text_from_pdf(filepath)
    except FileNotFoundError:
        return jsonify({"error": "Uploaded file could not be found on disk"}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to extract text: {str(e)}"}), 500

    if not text or not text.strip():
        return jsonify({
            "error": (
                "Could not extract any content from this PDF. "
                "If it is a scanned document, make sure Tesseract OCR is installed."
            )
        }), 400

    # ── Chunk the extracted text ────────────────────────────────────────────
    try:
        chunks = chunk_text(text, chunk_size=500, overlap=50)
    except Exception as e:
        return jsonify({"error": f"Failed to split text into chunks: {str(e)}"}), 500

    if not chunks:
        return jsonify({"error": "PDF was readable but produced no usable text chunks"}), 400

    # ── Build FAISS index ───────────────────────────────────────────────────
    try:
        build_index(chunks)
    except Exception as e:
        return jsonify({"error": f"Failed to build index: {str(e)}"}), 500

    current_file["name"] = filename
    current_file["chunks"] = len(chunks)

    return jsonify({
        "message": "PDF uploaded and indexed successfully",
        "filename": filename,
        "chunks": len(chunks),
    })


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()

    if not data or "question" not in data:
        return jsonify({"error": "No question provided"}), 400

    question = data["question"].strip()

    if not question:
        return jsonify({"error": "Question cannot be empty"}), 400

    if not current_file:
        return jsonify({"error": "No PDF uploaded yet. Please upload a PDF first."}), 400

    try:
        answer = get_answer(question)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/status", methods=["GET"])
def status():
    return jsonify(current_file if current_file else {"message": "No document indexed"})


# ── Error handlers ─────────────────────────────────────────────────────────

@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 16MB."}), 413


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error. Check your API key and dependencies."}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000, threaded=False)
=======
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from pdf_utils import extract_text, chunk_text
from rag import create_embeddings
from rag import store_embeddings
from rag import generate_answer

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload folder
UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# Home Route
@app.get("/")
def home():
    return {
        "message": "AI PDF Chat Assistant Running"
    }


# Upload PDF Route
@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):

    # Save PDF
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    text = extract_text(file_path)

    # Split text into chunks
    chunks = chunk_text(text)

    # Create embeddings
    embeddings = create_embeddings(chunks)

    # Store embeddings in FAISS
    store_embeddings(embeddings, chunks)

    return {
        "message": "PDF uploaded successfully",
        "total_chunks": len(chunks)
    }


# Ask Question Route
@app.get("/ask/")
def ask_question(query: str):

    answer = generate_answer(query)

    return {
        "question": query,
        "answer": answer
    }
>>>>>>> f49e9a07dfd6f01c2c3d2cd4fe7d5b1e4d8333ea
