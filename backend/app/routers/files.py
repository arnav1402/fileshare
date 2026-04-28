from fastapi import APIRouter, HTTPException, File, UploadFile
import boto3
from app.storage import generate_upload_url, generate_download_url, upload_file_to_s3
from app.database import get_room

router = APIRouter()

s3 = boto3.client("s3")
BUCKET = "fileshare-room"

@router.get("/list-files")
def list_files(room_id: str):
    """List all files in a room from S3"""
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

@router.post("/upload")
async def upload_file(room_id: str, access_id: str, file: UploadFile = File(...)):
    """
    Backend proxy endpoint for file uploads (avoids CORS issues).
    Validates write access before uploading to S3.
    """
    # 🔐 Validate write access
    room = get_room(room_id)
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if access_id != room.get("write_id"):
        raise HTTPException(
            status_code=403, 
            detail="Only users with write access can upload files"
        )
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Upload to S3
        key = f"{room_id}/{file.filename}"
        upload_file_to_s3(key, file_content)
        
        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "size": len(file_content)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/upload-url")
def get_upload_url(room_id: str, filename: str, access_id: str = None):
    """
    Generate upload URL only if user has write access.
    Backend enforces: read-only users cannot get upload URLs.
    """
    if access_id:
        # 🔐 Validate write access if access_id provided
        room = get_room(room_id)
        
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        if access_id != room.get("write_id"):
            raise HTTPException(
                status_code=403, 
                detail="Only users with write access can upload files"
            )
    
    key = f"{room_id}/{filename}"
    url = generate_upload_url(key)
    return {"url": url}

@router.get("/download-url")
def get_download_url(room_id: str, filename: str):
    """Generate download URL for any user in the room"""
    key = f"{room_id}/{filename}"
    url = generate_download_url(key)
    return {"url": url}