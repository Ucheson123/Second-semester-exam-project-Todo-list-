import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const fetchTodo = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://api.oluwasetemi.dev/tasks/${id}`, {
    headers: {
      "authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Could not find that task");
  return response.json();
};

const TodoDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // 1. I grab 'refetch' so it can refresh the screen automatically after an update
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTodo(id),
  });

  // 2. I Setup standard React State for our "Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("TODO");
  const [actionError, setActionError] = useState("");

  // DELETE FUNCTION
  const handleDelete = async () => {
    // I added a quick confirmation popup so users don't delete by accident
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://api.oluwasetemi.dev/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "authorization": `Bearer ${token}`,
        }
      });
      
      if (!response.ok) throw new Error("Failed to delete task");
      
      // Send them back to the Home page
      navigate("/"); 
    } catch (err) {
      setActionError(err.message);
    }
  };

  // UPDATE FUNCTIONS
  
  // This runs when you click the "Edit Task" button
  const handleEditClick = () => {
    setEditName(data.name);
    setEditStatus(data.status);
    setIsEditing(true); // Turns the text into a form
  };

  // This runs when you click "Save Changes
  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://api.oluwasetemi.dev/tasks/${id}`, {
        method: "PATCH", 
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: editName, status: editStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || "Failed to update task");
      }

      // This turns off edit mode and refresh the data on the screen
      setIsEditing(false);
      refetch(); 
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (isLoading) return <p>Loading details...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;

  return (
    <main className="app-container">
      <nav aria-label="Breadcrumb">
        <Link to="/">&larr; Back to Task List</Link>
      </nav>

      <div className="details-card">
        {actionError && <p className="error-text">{actionError}</p>}

        {/* IF THEY ARE EDITING: Show the update form */}
        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="edit-name">Task Name</label>
              <input 
                id="edit-name"
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-status">Status</label>
              <select 
                id="edit-status"
                value={editStatus} 
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="TODO">Pending</option>
                <option value="DONE">Completed</option>
              </select>
            </div>

            <div className="action-buttons">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          /* IF THEY ARE NOT EDITING: Show the normal details */
          <>
            <h1 className={data?.status === "DONE" ? "task-done-text" : "task-pending-text"}>
              {data?.name}
            </h1>

            <div className="task-meta">
              <p>
                <strong>Status:</strong> 
                <span className={`task-status-badge ${data?.status === "DONE" ? 'done' : ''}`}>
                    {data?.status === "DONE" ? "Completed" : "Pending"}
                </span>
              </p>
              <p><strong>Task ID:</strong> <code>{data?.id}</code></p>
              
              <p><strong>Description:</strong></p>
              <p className="description-text">
                {data?.description ? data.description : "No description provided."}
              </p>

              {data?.createdAt && (
                  <p><small>Created: {new Date(data.createdAt).toLocaleDateString()}</small></p>
              )}
            </div>

            <div className="action-buttons">
              <button onClick={handleEditClick} aria-label="Edit Task">Edit Task</button>
              <button onClick={handleDelete} aria-label="Delete Task">Delete Task</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default TodoDetails;