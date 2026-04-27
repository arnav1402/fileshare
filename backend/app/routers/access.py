from fastapi import APIRouter, HTTPException
from app.database import get_room
from app.auth import assume_role

router = APIRouter()

@router.post("/enter")
def enter_room(room_id: str, access_id: str):
    room = get_room(room_id)

    if not room:
        raise HTTPException(404, "Room not found")

    if access_id == room["read_id"]:
        role = "read"
    elif access_id == room["write_id"]:
        role = "write"
    else:
        raise HTTPException(403, "Invalid access")

    creds = assume_role(role, room_id)

    return creds