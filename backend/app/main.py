from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

# This defines what shape of JSON data we expect in the request body.
# FastAPI uses this to auto-validate incoming requests — if someone
# sends a request without "message", it auto-rejects with a clear error.
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    # This is the local API Ollama exposes — we talked about this earlier.
    # It's running on YOUR machine, port 11434.
    ollama_url = "http://localhost:11434/api/generate"

    payload = {
        "model": "llama3.2:1b",
        "prompt": request.message,
        "stream": False  # we'll explain streaming later — keep it simple for now
    }

    response = requests.post(ollama_url, json=payload)
    result = response.json()

    return {"reply": result["response"]}