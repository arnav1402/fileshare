from fastapi import APIRouter
from app.storage import generate_upload_url, generate_download_url

router = APIRouter()

@router.get("/upload-url")
def get_upload_url(room_id: str, filename: str):
    key = f"{room_id}/{filename}"
    url = generate_upload_url(key)
    return {"url": url}

@router.get("/download-url")
def get_download_url(room_id: str, filename: str):
    key = f"{room_id}/{filename}"
    url = generate_download_url(key)
    return {"url": url}