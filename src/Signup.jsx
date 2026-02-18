import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("https://api.oluwasetemi.dev/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || "Attempt to create an account failed.");
            }
            navigate("/login");
            
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <main className="auth-container">
            <header>
                <h2>Create an Account</h2>
            </header>

            {error && <p className="error-text" role="alert">{error}</p>}
            
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label htmlFor="signup-name">Name</label>
                    <input
                        id="signup-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="signup-email">Email</label>
                    <input
                        id="signup-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <input
                        id="signup-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            
            <div className="form-group">
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
    )
}

export default Signup;