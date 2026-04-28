import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="center">
            <h1>FileShare</h1>

            <button onClick={() => navigate("/login")}>
                CREATE A ROOM
            </button>

            <button onClick={() => navigate("/room")}>
                JOIN EXISTING ROOM
            </button>
        </div>
    );
}