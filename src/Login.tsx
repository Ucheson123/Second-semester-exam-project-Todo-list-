import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
export interface LoginResponse {
  accessToken: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  const navigate = useNavigate();

  // typed form submission event.
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://api.oluwasetemi.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = (await response.json()) as LoginResponse;
      
      console.log("SERVER LOGIN DATA:", data);  
      
      localStorage.setItem("token", data.accessToken); 
      navigate("/"); 
      
    } catch (err) {
      // checked error type before accessing '.message'
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during login.");
      }
    }
  };

  return (
    <main className="auth-container">
      <header>
        <h2>Login to your Account</h2>
      </header>
      
      {error && <p className="error-text" role="alert">{error}</p>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input 
            id="login-email"
            type="email" 
            required 
            value={email} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input 
            id="login-password"
            type="password" 
            required 
            value={password} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Login</button>
      </form>
      
      <div className="form-group">
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </main>
  );
};

export default Login;