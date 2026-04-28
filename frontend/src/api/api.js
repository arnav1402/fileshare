const BASE_URL = "http://127.0.0.1:8000";

export const api = {
    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/admin/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log("RAW RESPONSE:", data);

        return data; // ✅ return already-read data
    },

  createRoom: async (name, description, expiry = 2) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/admin/rooms?expiry_hours=${expiry}`, // ✅ query param
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ REQUIRED
        },
        body: JSON.stringify({
          name,
          description,
        }),
      }
    );

    return res.json();
  },

    enterRoom: async (room_id, access_id) => {
        const res = await fetch(
            `${BASE_URL}/auth/enter?room_id=${room_id}&access_id=${access_id}`,
            {
            method: "POST",
            }
        );

        return res.json();
    },

    getFiles: async (room_id) => {
        const res = await fetch(
            `${BASE_URL}/files/list-files?room_id=${room_id}`
        );
        return res.json();
    },

  getUploadUrl: async (room_id, filename) => {
    const res = await fetch(
      `${BASE_URL}/files/upload-url?room_id=${room_id}&filename=${filename}`
    );
    return res.json();
  },

  getDownloadUrl: async (room_id, filename) => {
    const res = await fetch(
      `${BASE_URL}/files/download-url?room_id=${room_id}&filename=${filename}`
    );
    return res.json();
  },
};