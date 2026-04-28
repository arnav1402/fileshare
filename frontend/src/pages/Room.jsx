import { useState, useEffect } from "react";
import { api } from "../api/api";
import FileUpload from "../components/FileUpload";

export default function Room() {
    const [roomId, setRoomId] = useState("");
    const [accessId, setAccessId] = useState("");
    const [joined, setJoined] = useState(false);
    const [role, setRole] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const joinRoom = async () => {
        try {
            const res = await api.enterRoom(roomId, accessId);

            if (res.role) {
                setJoined(true);
                setRole(res.role);
                
                // ✅ Load files after joining
                fetchFiles();
            } else {
                alert("Failed to join room");
            }
        } catch (err) {
            console.error("Error joining room:", err);
            alert("Error joining room: " + err.message);
        }
    };

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await api.getFiles(roomId);
            setFiles(res.files || []);
        } catch (err) {
            console.error("Error fetching files:", err);
            alert("Error loading files");
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = async (filename) => {
        try {
            const res = await api.getDownloadUrl(roomId, filename);
            
            if (res.url) {
                // Open download URL in new tab
                window.open(res.url, "_blank");
            }
        } catch (err) {
            console.error("Error downloading file:", err);
            alert("Error downloading file");
        }
    };

    const handleLeaveRoom = () => {
        setJoined(false);
        setRole(null);
        setFiles([]);
        setRoomId("");
        setAccessId("");
    };

    return (
        <div className="center">
            <div className="content">
                {!joined ? (
                    <div>
                        <h2>🔗 Join a Room</h2>
                        <p style={{ marginBottom: "30px" }}>Enter the Room ID and Access ID to join</p>

                        <input
                            placeholder="Enter Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />

                        <input
                            placeholder="Enter Access ID"
                            value={accessId}
                            onChange={(e) => setAccessId(e.target.value)}
                        />

                        <button onClick={joinRoom} style={{ width: "100%", maxWidth: "100%", marginTop: "20px" }}>
                            ✓ Join Room
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className={`room-status ${role === "read" ? "read" : ""}`}>
                            ✅ Joined as {role === "write" ? "📝 Editor" : "👁️ Viewer"}
                        </div>

                        <hr />

                        {/* ✅ File Upload (write users only) */}
                        <FileUpload 
                            roomId={roomId} 
                            accessId={accessId}
                            role={role}
                            onUploadComplete={fetchFiles}
                        />

                        <hr />

                        {/* ✅ File List with Refresh */}
                        <h3>📂 Files in Room</h3>
                        
                        <button 
                            onClick={fetchFiles}
                            disabled={loading}
                        >
                            🔄 Refresh Files
                        </button>

                        {loading ? (
                            <p style={{ marginTop: "20px" }}><em>Loading files...</em></p>
                        ) : files.length === 0 ? (
                            <div className="info-box" style={{ marginTop: "20px" }}>
                                No files in this room yet
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

                        <hr />

                        <button 
                            onClick={handleLeaveRoom}
                            className="danger"
                            style={{ marginTop: "20px" }}
                        >
                            Leave Room
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}