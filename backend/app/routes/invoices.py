from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

router = APIRouter()

# Connexion MongoDB (à adapter avec ta config)
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.invoice_ai_db
invoices_collection = db.invoices

# Helper pour convertir ObjectId en string
def invoice_helper(invoice) -> dict:
    return {
        "id": str(invoice["_id"]),
        "filename": invoice["filename"],
        "content_type": invoice["content_type"],
        "size": invoice["size"],
    }

@router.post("/upload")
async def upload_invoice(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".pdf", ".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="Format de fichier non supporté.")
    content = await file.read()
    invoice_data = {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(content),
        "file_bytes": content,  # Stockage en binaire, attention à la taille !
    }
    result = await invoices_collection.insert_one(invoice_data)
    return {"message": "Fichier reçu et enregistré", "id": str(result.inserted_id), "filename": file.filename}

@router.get("/")
async def get_invoices():
    invoices_cursor = invoices_collection.find()
    invoices = []
    async for invoice in invoices_cursor:
        invoices.append(invoice_helper(invoice))
    return JSONResponse(content=invoices)
