import { useState } from "react";
import { api } from "../api/api";
import FileUpload from "../components/FileUpload";

export default function Room() {
    const [roomId, setRoomId] = useState("");
    const [accessId, setAccessId] = useState("");
    const [joined, setJoined] = useState(false);
    const [creds, setCreds] = useState(null);

    const joinRoom = async () => {
        const res = await api.enterRoom(roomId, accessId);

        if (res.credentials) {
            setJoined(true);
            setCreds(res); // store role + creds
        } else {
            alert("Invalid room or access ID");
        }
    };

    return (
        <div className="center">
            <h2>Join Room</h2>

            {!joined ? (
                <>
                    <input
                        placeholder="Enter Room ID"
                        onChange={(e) => setRoomId(e.target.value)}
                    />

                    <input
                        placeholder="Enter Access ID"
                        onChange={(e) => setAccessId(e.target.value)}
                    />

                    <button onClick={joinRoom}>Join</button>
                </>
            ) : (
                <FileUpload roomId={roomId} creds={creds} />
            )}
        </div>
    );
}