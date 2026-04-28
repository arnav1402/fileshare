import { api } from "../api/api";

export default function FileUpload({ roomId }) {
    const uploadFile = async (e) => {
        const file = e.target.files[0];

        const res = await api.getUploadUrl(roomId, file.name);

        const uploadUrl = res.upload_url;

        await fetch(uploadUrl, {
            method: "PUT",
            body: file,
        });

        alert("Uploaded!");
    };

    return (
        <div>
            <h3>Upload File</h3>
            <input type="file" onChange={uploadFile} />
        </div>
    );
}