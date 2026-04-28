import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Dashboard() {
    const [room, setRoom] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            const res = await api.getFiles(room_id);
            console.log("FILES:", res);

            setFiles(res.files || []);
        } catch (err) {
            console.error("Error fetching files:", err);
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = async (filename) => {
        try {
            const res = await api.getDownloadUrl(room.room_id, filename);
            
            if (res.url) {
                // Open download URL in new tab
                window.open(res.url, "_blank");
            }
        } catch (err) {
            console.error("Error downloading file:", err);
            alert("Error downloading file");
        }
    };

    if (!room) return (
        <div className="center">
            <div className="container">
                <h2>⚠️ No Room Found</h2>
                <p>Create or join a room to get started.</p>
            </div>
        </div>
    );

    return (
        <div className="center">
            <div className="content">
                <div className="dashboard-header">
                    <h2>🎉 Room Created</h2>
                    <p style={{ color: "white", marginBottom: 0 }}>{room.name}</p>
                </div>

                <div className="room-info">
                    <div className="room-info-item">
                        <b>Room ID</b>
                        <p>{room.room_id}</p>
                    </div>
                    <div className="room-info-item">
                        <b>Name</b>
                        <p>{room.name}</p>
                    </div>
                    <div className="room-info-item">
                        <b>Read ID</b>
                        <p>{room.read_access}</p>
                    </div>
                    <div className="room-info-item">
                        <b>Write ID</b>
                        <p>{room.write_access}</p>
                    </div>
                </div>

                {room.description && (
                    <div className="section">
                        <b>Description</b>
                        <p>{room.description}</p>
                    </div>
                )}

                <div className="section">
                    <b>Expires</b>
                    <p>{new Date(room.expires_at * 1000).toLocaleString()}</p>
                </div>

                <hr />

                <h3>📂 Uploaded Files</h3>

                {/* ✅ Refresh Button */}
                <button 
                    onClick={() => fetchFiles(room.room_id)}
                    disabled={loading}
                    style={{ marginTop: "15px" }}
                >
                    🔄 Refresh Files
                </button>

                {/* ✅ File List with Downloads */}
                {loading ? (
                    <p style={{ marginTop: "20px" }}><em>Loading files...</em></p>
                ) : files.length === 0 ? (
                    <div className="info-box" style={{ marginTop: "20px" }}>
                        No files uploaded yet. Share the Read/Write IDs to invite users.
                    </div>
                ) : (
                    <ul style={{ marginTop: "20px" }}>
                        {files.map((file, index) => (
                            <li key={index}>
                                <strong>📄 {file.filename}</strong>
                                <small>
                                    Size: {(file.size / 1024).toFixed(2)} KB | 
                                    Modified: {new Date(file.last_modified).toLocaleString()}
                                </small>
                                <br />
                                <button 
                                    onClick={() => downloadFile(file.filename)}
                                    style={{ marginTop: "8px" }}
                                >
                                    ⬇️ Download
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}