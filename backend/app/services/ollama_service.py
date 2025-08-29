import ollama

MODEL_NAME = "llama2"  # ou autre modèle installé localement

def analyze_text(text: str):
    prompt = f"Analyse cette facture et retourne les informations clés:\n\n{text}"
    response = ollama.chat(model=MODEL_NAME, messages=[{"role": "user", "content": prompt}])
    return response["message"]["content"]
