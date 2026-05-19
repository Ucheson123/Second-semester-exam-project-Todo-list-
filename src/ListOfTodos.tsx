import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// defined blueprints for a todo object
export interface Todo {
  id: string | number;
  name: string;
  status: "TODO" | "DONE";
  description?: string;
  createdAt?: string;
}

// defined the blueprint for the API's pagination details.
export interface PaginationMeta {
  totalPages: number;
  hasNextPage: boolean;
}

// i combined them to define the exact shape of the API response.
export interface PaginatedTodoResponse {
  data: Todo[];
  meta: PaginationMeta;
}

const fetchData = async (page: number): Promise<PaginatedTodoResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://api.oluwasetemi.dev/tasks?page=${page}&limit=10`, {
    headers: {
      "authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch data");    
  }
  
  return response.json();
}

const ListOfTodos: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // proviuded the Response and Error types to useQuery.
  const { data, isLoading, error } = useQuery<PaginatedTodoResponse, Error>({
    queryKey: ["tasks", currentPage],
    queryFn: () => fetchData(currentPage),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };
  
  if (isLoading) return <p>Loading tasks...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;

  const tasksList = data?.data || []; 
  const metaInfo = data?.meta; 

  const filteredTasks = tasksList.filter(
    (task) => task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="list-section">
      <header>
        <h2>My Tasks</h2>
      </header>
      
      <div className="form-group">
        <input 
          type="text"
          placeholder="Search for a task..."
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Search tasks"
        />
      </div>

      <div className="task-list">
        {filteredTasks.map((task) => (
          <article key={task.id} className={`task-item ${task.status === "DONE" ? 'completed' : ''}`}>
            <Link to={`/tasks/${task.id}`}>
              <span className={task.status === "DONE" ? "task-done-text" : "task-pending-text"}>
                {task.name}
              </span>
            </Link>
            <span className={`task-status-badge ${task.status === "DONE" ? 'done' : ''}`}>
              {task.status === "DONE" ? 'Completed' : 'Pending'}
            </span>
          </article>
        ))}
        
        {filteredTasks.length === 0 && <p>No tasks found.</p>}
      </div>

      <nav className="pagination-controls" aria-label="Pagination Navigation">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {metaInfo?.totalPages || 1} </span>
        <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={!metaInfo?.hasNextPage}>
          Next
        </button>
      </nav>
    </section>
  );
}

export default ListOfTodos;