from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_room
from app.auth import assume_role

router = APIRouter()


@router.post("/enter")
def enter_room(room_id: str, access_id: str):
    """
    Validate access to room and determine user role.
    Returns role and temporary AWS credentials.
    """
    room = get_room(room_id)

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # 🔐 Validate access and determine role
    if access_id == room.get("read_id"):
        role = "read"
    elif access_id == room.get("write_id"):
        role = "write"
    else:
        raise HTTPException(status_code=403, detail="Invalid access ID")

    # 🔑 Assume role to get temporary credentials
    creds = assume_role(role, room_id)

    return {
        "message": "Access granted",
        "room_id": room_id,
        "role": role,
        "credentials": creds
    }