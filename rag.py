<<<<<<< HEAD
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

embedder = SentenceTransformer("all-MiniLM-L6-v2")

chunks: list[str] = []
index = None


def build_index(text_chunks: list[str]) -> None:
    global chunks, index
    chunks = text_chunks
    embeddings = embedder.encode(text_chunks, convert_to_numpy=True)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings.astype(np.float32))


def retrieve(query: str, top_k: int = 3) -> list[str]:
    if index is None or len(chunks) == 0:
        return []
    q_emb = embedder.encode([query], convert_to_numpy=True).astype(np.float32)
    _, indices = index.search(q_emb, top_k)
    return [chunks[i] for i in indices[0] if i < len(chunks)]


def get_answer(query: str) -> str:
    context_chunks = retrieve(query)

    if not context_chunks:
        return "No document has been indexed yet. Please upload a PDF first."

    context = "\n\n".join(context_chunks)

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    chat_completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant that answers questions strictly "
                    "based on the provided PDF context. If the answer is not found "
                    "in the context, clearly say that the information is not available "
                    "in the document."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Context extracted from the PDF:\n\n{context}\n\n"
                    f"Question: {query}\n\n"
                    f"Please answer based only on the context above."
                ),
            },
        ],
        temperature=0.3,
        max_tokens=1024,
    )

    return chat_completion.choices[0].message.content
=======
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import google.generativeai as genai

# Gemini API Key
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Gemini Model
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# Embedding Model
embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# Global Variables
stored_chunks = []
faiss_index = None


# Create Embeddings
def create_embeddings(chunks):

    embeddings = embedding_model.encode(chunks)

    return embeddings


# Store embeddings in FAISS
def store_embeddings(embeddings, chunks):

    global faiss_index
    global stored_chunks

    stored_chunks = chunks

    dimension = embeddings.shape[1]

    faiss_index = faiss.IndexFlatL2(dimension)

    faiss_index.add(
        np.array(embeddings, dtype=np.float32)
    )


# Search relevant chunks
def search_chunks(query, top_k=3):

    query_embedding = embedding_model.encode([query])

    distances, indices = faiss_index.search(
        np.array(query_embedding, dtype=np.float32),
        top_k
    )

    results = []

    for idx in indices[0]:

        results.append(stored_chunks[idx])

    return results


# Generate answer using Gemini
def generate_answer(query):

    relevant_chunks = search_chunks(query)

    context = "\n".join(relevant_chunks)

    prompt = f"""
    Answer the question based on the context.

    Context:
    {context}

    Question:
    {query}
    """

    response = gemini_model.generate_content(prompt)

    return response.text
>>>>>>> f49e9a07dfd6f01c2c3d2cd4fe7d5b1e4d8333ea
