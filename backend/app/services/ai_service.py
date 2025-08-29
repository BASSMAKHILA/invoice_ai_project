# app/services/ai_service.py
import aiohttp
from app.config import OLLAMA_MODEL

async def analyze_invoice_with_ai(text: str) -> str:
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"Extract structured invoice data from the following text:\n{text}"
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as resp:
            if resp.status != 200:
                return "AI analysis failed"
            data = await resp.json()
            return data.get("response", "AI analysis failed")
