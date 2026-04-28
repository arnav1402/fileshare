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
            <div className="container">
                <h2>📝 Create New Room</h2>
                <p style={{ marginBottom: "30px" }}>Set up a new file sharing room</p>

                <input
                    placeholder="Room Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    placeholder="Description (optional)"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />

                <button onClick={handleCreate} style={{ width: "100%", maxWidth: "100%", marginTop: "20px" }}>
                    ✓ Create Room
                </button>
            </div>
        </div>
    );
}