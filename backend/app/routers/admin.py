import uuid
import time
from fastapi import APIRouter, Depends
from app.auth import login, verify_token
from app.database import save_room

router = APIRouter()

@router.post("/login")
def admin_login(email: str, password: str):
    token = login(email, password)
    return {"token": token}


@router.post("/rooms")
def create_room(expiry_hours: int, user=Depends(verify_token)):
    room_id = str(uuid.uuid4())
    read_id = str(uuid.uuid4())
    write_id = str(uuid.uuid4())

    ttl = int(time.time()) + expiry_hours * 3600

    save_room({
        "room_id": room_id,
        "read_id": read_id,
        "write_id": write_id,
        "ttl": ttl
    })

    return {
        "room_id": room_id,
        "read_access": read_id,
        "write_access": write_id
    }