import os
from fastapi import UploadFile
from pdf2image import convert_from_path
from PyPDF2 import PdfReader

UPLOAD_FOLDER = "uploads"

def save_file_and_detect_type(file: UploadFile) -> tuple[str, str]:
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    # Détection type
    if file.content_type.startswith("image/"):
        return file_path, "image"

    if file.content_type == "application/pdf":
        try:
            reader = PdfReader(file_path)
            if reader.pages:
                # Test si le pdf contient du texte
                first_page = reader.pages[0]
                text = first_page.extract_text()
                if text and text.strip():
                    return file_path, "pdf_text"
                else:
                    return file_path, "pdf_scanned"
        except Exception:
            # En cas d'erreur on considère pdf scanné
            return file_path, "pdf_scanned"

    raise Exception("Type de fichier non supporté")
