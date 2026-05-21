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