import { useState } from "react";
import { api } from "../api/api";

export default function FileUpload({ roomId, accessId, role, onUploadComplete }) {
    const [loading, setLoading] = useState(false);

    // 🔐 Only show upload for write users
    if (role === "read") {
        return (
            <div>
                <h3>📄 Files</h3>
                <p style={{ color: "#888" }}>
                    <em>You have read-only access. Upload disabled.</em>
                </p>
            </div>
        );
    }

    const uploadFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            // ✅ Upload via backend proxy (avoids CORS issues)
            await api.uploadFile(roomId, accessId, file);
            
            alert("Uploaded! Refreshing file list...");
            
            // ✅ Refresh files list after upload
            if (onUploadComplete) {
                onUploadComplete();
            }
            
            // Clear input
            e.target.value = "";
        } catch (err) {
            console.error("Upload error:", err);
            alert("Upload failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>📤 Upload File</h3>
            <input
                type="file"
                onChange={uploadFile}
                disabled={loading}
            />
            {loading && <p><em>Uploading...</em></p>}
        </div>
    );
}