import pytesseract
from pdf2image import convert_from_bytes
from PyPDF2 import PdfReader
from PIL import Image
import io

def extract_text_from_pdf(file_bytes: bytes):
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ''
        for page in reader.pages:
            text += page.extract_text() or ''
        return text.strip()
    except:
        return ''

def extract_text_from_image(file_bytes: bytes):
    try:
        image = Image.open(io.BytesIO(file_bytes))
        return pytesseract.image_to_string(image)
    except:
        return ''

def extract_text(file_bytes: bytes, filename: str):
    if filename.endswith('.pdf'):
        text = extract_text_from_pdf(file_bytes)
        if not text:  # Si PDF scanné
            images = convert_from_bytes(file_bytes)
            text = ''.join(pytesseract.image_to_string(img) for img in images)
        return text.strip()
    elif filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        return extract_text_from_image(file_bytes)
    else:
        return ''

def detect_document_type(text: str):
    text_lower = text.lower()
    if 'facture' in text_lower:
        return 'facture'
    elif 'bon de commande' in text_lower or 'bdc' in text_lower:
        return 'bdc'
    else:
        return 'inconnu'
