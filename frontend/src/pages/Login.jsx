import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.login(email, password);

            console.log("LOGIN RESPONSE:", res); // 🔥 DEBUG

            if (res.token) {
                // ✅ Save token
                localStorage.setItem("token", res.token);

                // ✅ Navigate to next page
                navigate("/create-room");
            } else {
                alert("Login failed");
            }

        } catch (err) {
            console.error(err);
            alert("Error logging in");
        }
    };

    return (
        <div className="center">
            <div className="container">
                <h2>🔐 Admin Login</h2>
                <p style={{ marginBottom: "30px" }}>Sign in to create and manage rooms</p>

                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleLogin} style={{ width: "100%", maxWidth: "100%", marginTop: "20px" }}>
                    Login
                </button>
            </div>
        </div>
    );
}