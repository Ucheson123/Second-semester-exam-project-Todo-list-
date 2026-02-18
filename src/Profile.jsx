import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const fetchProfile = async () => {
  const token = localStorage.getItem("token");
  
  const response = await fetch("https://api.oluwasetemi.dev/auth/me", {
    headers: { 
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    //This catches the exact error from the server
    const errorData = await response.json().catch(() => ({})); 
    throw new Error(errorData.message || errorData.error || `Failed to load profile (Status: ${response.status})`);
  }
  
  return response.json();
};

const Profile = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile
  });

  const handleLogout = () => {
    // 1. This disconnects the user.
    localStorage.removeItem("token");
    // 2. This gets the user back to the login screen
    navigate("/login");
  };

  if (isLoading) return <main className="app-container"><p>Loading profile...</p></main>;
  // If there is an error (like an expired token), still show the card and a Log Out button
  if (error) return (
    <main className="app-container">
      <div className="details-card">
        <p className="error-text">{error.message} - Please log in again.</p>
        <div className="action-buttons">
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </main>
  );

  return (
    <main className="app-container">
      <nav aria-label="Breadcrumb">
        <Link to="/">&larr; Back to Home</Link>
      </nav>
      
      <div className="details-card">
        <h2>My Profile</h2>
        {/* The API returns your name and email here */}
        <p><strong>Name:</strong> {data?.name}</p>
        <p><strong>Email:</strong> {data?.email}</p>
        
        <div className="action-buttons">
            <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </main>
  );
};

export default Profile;