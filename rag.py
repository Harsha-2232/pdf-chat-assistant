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