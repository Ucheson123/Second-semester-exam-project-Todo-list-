import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Todo {
  id: string | number;
  name: string;
  status: "TODO" | "DONE";
  description?: string;
  createdAt?: string;
}

const fetchTodo = async (id: string): Promise<Todo> => {
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

const TodoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery<Todo, Error>({
    queryKey: ["task", id],
    // i use 'id as string' because useParams technically thinks id could be undefined
    queryFn: () => fetchTodo(id as string), 
    enabled: !!id, // Only run the query if the id actually exists
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<"TODO" | "DONE">("TODO");
  const [actionError, setActionError] = useState("");

  const handleDelete = async () => {
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
      
      navigate("/"); 
    } catch (err) {
      if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError("An unknown error occurred");
      }
    }
  };

  const handleEditClick = () => {
    if (data) {
      setEditName(data.name);
      setEditStatus(data.status);
      setIsEditing(true); 
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
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

      setIsEditing(false);
      refetch(); 
    } catch (err) {
      if (err instanceof Error) {
        setActionError(err.message);
      }
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
                onChange={(e) => setEditStatus(e.target.value as "TODO" | "DONE")}
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