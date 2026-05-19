import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
  name: string;
  email: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const fetchProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  
  const response = await fetch("https://api.oluwasetemi.dev/auth/me", {
    headers: { 
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiErrorResponse; 
    throw new Error(errorData.message || errorData.error || `Failed to load profile (Status: ${response.status})`);
  }
  
  return response.json();
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useQuery<UserProfile, Error>({
    queryKey: ["profile"],
    queryFn: fetchProfile
  });

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) return <main className="app-container"><p>Loading profile...</p></main>;
  
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