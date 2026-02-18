import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
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

      const data = await response.json();
      console.log("SERVER LOGIN DATA:", data);  //i used this console.log to check the data coming from the server(I initially used "token" instead of "accessToken" and this helped me catch that error)
      localStorage.setItem("token", data.accessToken); 
      navigate("/"); 
      
    } catch (err) {
      setError(err.message);
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
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input 
            id="login-password"
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Login</button>
      </form>
      
      <p>
      </p>
      <div className="form-group">
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </main>
  );
};

export default Login;