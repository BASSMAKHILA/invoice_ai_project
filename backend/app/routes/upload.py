from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Facture, BDC
from utils import extract_text, detect_document_type

router = APIRouter()

@router.post("/upload/")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_bytes = await file.read()
    filename = file.filename

    if not filename.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Seuls les fichiers PDF et images sont autorisés.")

    # Extraction du texte brut
    raw_text = extract_text(file_bytes, filename)

    if not raw_text:
        raise HTTPException(status_code=400, detail="Le contenu est vide après extraction.")

    # Détection du type
    doc_type = detect_document_type(raw_text)

    # Sauvegarde dans la bonne collection
    if doc_type == 'facture':
        doc = Facture(filename=filename, raw_content=raw_text)
        db.add(doc)
    elif doc_type == 'bdc':
        doc = BDC(filename=filename, raw_content=raw_text)
        db.add(doc)
    else:
        raise HTTPException(status_code=400, detail="Type de document non reconnu (ni facture ni BDC).")

    db.commit()
    return {"message": f"{doc_type.upper()} enregistrée avec succès", "filename": filename}
