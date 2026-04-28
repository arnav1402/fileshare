import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="center">
            <div className="container">
                <h1>🚀 FileShare</h1>
                <p style={{ fontSize: "1.1rem", marginBottom: "40px" }}>
                    Secure file sharing made simple
                </p>

                <div className="home-buttons">
                    <button onClick={() => navigate("/login")}>
                        ➕ CREATE A ROOM
                    </button>

                    <button className="secondary" onClick={() => navigate("/room")}>
                        🔗 JOIN EXISTING ROOM
                    </button>
                </div>
            </div>
        </div>
    );
}