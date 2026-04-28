import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Dashboard() {
    const [room, setRoom] = useState(null);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("room");

        if (stored) {
            const parsed = JSON.parse(stored);
            setRoom(parsed);

            // ✅ load files when dashboard loads
            fetchFiles(parsed.room_id);
        }
    }, []);

    const fetchFiles = async (room_id) => {
        try {
            const res = await api.getFiles(room_id);
            console.log("FILES:", res);

            setFiles(res.files || []);
        } catch (err) {
            console.error("Error fetching files:", err);
        }
    };

    if (!room) return <h2>No Room Found</h2>;

    return (
        <div className="center">
            <h2>Room Created 🎉</h2>

            <p><b>ID:</b> {room.room_id}</p>
            <p><b>Name:</b> {room.name}</p>
            <p><b>Description:</b> {room.description}</p>
            <p><b>Read ID:</b> {room.read_access}</p>
            <p><b>Write ID:</b> {room.write_access}</p>
            <p><b>Expires:</b> {new Date(room.expires_at * 1000).toLocaleString()}</p>

            <hr />

            <h3>📂 Uploaded Files</h3>

            {/* ✅ Refresh Button */}
            <button onClick={() => fetchFiles(room.room_id)}>
                Refresh Files
            </button>

            {/* ✅ File List */}
            {files.length === 0 ? (
                <p>No files uploaded yet</p>
            ) : (
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>
                            📄 {file.filename} — {file.size} bytes
                            <br />
                            <small>{file.last_modified}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}