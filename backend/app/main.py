from fastapi import FastAPI
from pydantic import BaseModel
import requests
from app.memory import init_db, save_message, get_recent_messages

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the messages table on startup if it doesn't exist yet
init_db()

class ChatRequest(BaseModel):
    message: str

def build_prompt(history, new_message: str) -> str:
    """
    Turns the conversation history into a single text block
    the model can read as context, then appends the new question.
    """
    prompt = ""
    for role, content in history:
        if role == "user":
            prompt += f"User: {content}\n"
        else:
            prompt += f"AI: {content}\n"
    prompt += f"User: {new_message}\nAI:"
    return prompt

@app.post("/chat")
def chat(request: ChatRequest):
    # 1. Save the user's new message first
    save_message("user", request.message)

    # 2. Pull recent history (includes the message we just saved)
    history = get_recent_messages(limit=10)

    # 3. Build the full prompt with context
    full_prompt = build_prompt(history[:-1], request.message)

    # 4. Call Ollama with the FULL conversation as context, not just one line
    ollama_url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3.2:1b",
        "prompt": full_prompt,
        "stream": False
    }
    response = requests.post(ollama_url, json=payload)
    result = response.json()
    ai_reply = result["response"]

    # 5. Save the AI's reply too, so the NEXT request includes it
    save_message("assistant", ai_reply)

    return {"reply": ai_reply}