
from fastapi import APIRouter, HTTPException
import os
from app.config import UPLOAD_FOLDER

router = APIRouter()

@router.get("/")
async def list_files():
    if not os.path.exists(UPLOAD_FOLDER):
        return {"files": []}
    return {"files": os.listdir(UPLOAD_FOLDER)}

@router.delete("/{filename}")
async def delete_file(filename: str):
    path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(path):
        os.remove(path)
        return {"message": f"{filename} deleted"}
    raise HTTPException(status_code=404, detail="File not found")
