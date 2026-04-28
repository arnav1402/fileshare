import uuid
import time
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.auth import login, verify_token
from app.database import save_room

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def admin_login(data: LoginRequest):
    token = login(data.email, data.password)
    return {"token": token}

class RoomCreate(BaseModel):
    name: str
    description: str
    expiry_hours: int = 2


@router.post("/rooms")
def create_room(
    data: RoomCreate,
    user=Depends(verify_token)
):
    room_id = str(uuid.uuid4())
    read_id = str(uuid.uuid4())
    write_id = str(uuid.uuid4())

    ttl = int(time.time()) + data.expiry_hours * 3600

    item = {
        "room_id": room_id,
        "name": data.name,
        "description": data.description,
        "read_id": read_id,
        "write_id": write_id,
        "expires_at": ttl
    }

    save_room(item)

    return {
        "room_id": room_id,
        "name": data.name,
        "description": data.description,
        "read_access": read_id,
        "write_access": write_id,
        "expires_at": ttl
    }