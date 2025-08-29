import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import os

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_image_or_pdf(file_path: str) -> str:
    try:
        if file_path.lower().endswith(".pdf"):
            images = convert_from_path(file_path)
            text = ""
            for img in images:
                ocr_text = pytesseract.image_to_string(img, lang="fra")
                text += ocr_text + "\n"
            print(f"[OCR] Texte extrait de PDF ({file_path}) : {len(text)} caractères")
            return text.strip()
        else:
            with Image.open(file_path) as img:
                text = pytesseract.image_to_string(img, lang="fra")
                print(f"[OCR] Texte extrait de l’image ({file_path}) : {len(text)} caractères")
                return text.strip()
    except Exception as e:
        print(f"[OCR ERROR] Échec de l’extraction OCR pour {file_path} : {e}")
        return ""
