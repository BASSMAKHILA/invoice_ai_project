import os
from dotenv import load_dotenv

load_dotenv()

# Exemple d'URL MongoDB (à adapter à ta config)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Nom de ta base Mongo
DB_NAME = os.getenv("DB_NAME", "invoice_db")

# Chemin vers Tesseract OCR
TESSERACT_PATH = os.getenv("TESSERACT_PATH", r"C:\Program Files\Tesseract-OCR\tesseract.exe")

# Dossier uploads
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")

# Variables pour Ollama
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434")
OLLAMA_MODEL = "ollama/model_name"