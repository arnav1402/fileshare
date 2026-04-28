from fastapi import APIRouter, HTTPException
from app.database import get_room
from app.auth import assume_role

router = APIRouter()

@router.post("/enter")
def enter_room(room_id: str, access_id: str):
    room = get_room(room_id)

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # 🔐 Validate access
    if access_id == room["read_id"]:
        role = "read"
    elif access_id == room["write_id"]:
        role = "write"
    else:
        raise HTTPException(status_code=403, detail="Invalid access ID")

    # 🔥 Assume role (STS)
    creds = assume_role(role, room_id)

    return {
        "message": "Access granted",
        "role": role,
        "credentials": creds
    }