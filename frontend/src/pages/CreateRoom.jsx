import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!name) {
            alert("Room name required");
            return;
        }

        const res = await api.createRoom(name, desc, 2);
        console.log("ROOM RESPONSE:", res);
        localStorage.setItem("room", JSON.stringify(res));

        navigate("/dashboard");
    };

    return (
        <div className="center">
            <h2>Create Room</h2>

            <input
                placeholder="Room Name"
                onChange={(e) => setName(e.target.value)}
            />

            <textarea
                placeholder="Description"
                onChange={(e) => setDesc(e.target.value)}
            />

            <button onClick={handleCreate}>
                Create Room
            </button>
        </div>
    );
}