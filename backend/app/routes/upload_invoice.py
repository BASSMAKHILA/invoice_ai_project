from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
import uuid

# Importer votre fonction de traitement, par exemple:
# from core.ocr import process_invoice_file

router = APIRouter()

UPLOAD_DIR = "uploaded_invoices"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-invoice/")
async def upload_invoice(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont autorisés.")

        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 🧠 Traiter le fichier ici (OCR, extraction, etc.)
        # Exemple :
        # result = process_invoice_file(file_path)

        # ✅ Simulation d'un résultat temporaire
        result = {
            "invoice_id": file_id,
            "message": "Facture traitée avec succès (simulation)",
            "file_name": file.filename,
            "extracted_data": {
                "invoice_number": "INV-12345",
                "date": "2025-08-07",
                "client": "Client Exemple SARL",
                "total": "1523.00 MAD"
            }
        }

        return JSONResponse(status_code=200, content=result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement : {str(e)}")
