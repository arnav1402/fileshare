from fastapi import APIRouter
import boto3
from app.storage import generate_upload_url, generate_download_url

router = APIRouter()

s3 = boto3.client("s3")
BUCKET = "fileshare-room"

@router.get("/list-files")
def list_files(room_id: str):
    res = s3.list_objects_v2(
        Bucket=BUCKET,
        Prefix=f"{room_id}/"
    )

    files = []

    if "Contents" in res:
        for obj in res["Contents"]:
            key = obj["Key"]

            # skip folder itself
            if key.endswith("/"):
                continue

            files.append({
                "filename": key.split("/")[-1],
                "size": obj["Size"],
                "last_modified": str(obj["LastModified"])
            })

    return {"files": files}

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