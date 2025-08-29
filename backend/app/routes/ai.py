from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_handler import save_file_and_detect_type
from app.services.ocr_service import extract_text_from_image_or_pdf
from app.services.pdf_parser import extract_text_from_pdf_text
from app.services.ai_service import analyze_invoice_with_ai
import os

router = APIRouter()

@router.post("/upload/")
async def upload_invoice(file: UploadFile = File(...)):
    file_path, file_type = save_file_and_detect_type(file)

    if file_type in ["image", "pdf_scanned"]:
        raw_text = extract_text_from_image_or_pdf(file_path)
    elif file_type == "pdf_text":
        raw_text = extract_text_from_pdf_text(file_path)
    else:
        # Supprime le fichier si ce n'est pas supporté pour ne pas garder de fichiers inutiles
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=400, detail="Unsupported file type")

    try:
        ai_result = await analyze_invoice_with_ai(raw_text)
    except Exception as e:
        # Gérer proprement les erreurs de l'IA pour ne pas planter l'API
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # Optionnel : supprimer le fichier uploadé après traitement
    if os.path.exists(file_path):
        os.remove(file_path)

    return {
        "raw_text": raw_text,
        "ai_result": ai_result
    }
