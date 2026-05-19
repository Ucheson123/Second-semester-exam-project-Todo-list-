import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import ListOfTodos from "./ListOfTodos";
import UploadTodo from "./UploadTodo";
import ErrorBoundary from "./ErrorBoundary";
import TestErrorBoundary from "./TestErrorBoundary";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Signup from "./Signup";

import "./index.css";
import "./App.css";

// Lazy loaded components remain exactly the same
const TodoDetails = lazy(() => import("./TodoDetails"));
const Profile = lazy(() => import("./Profile"));

// 1. Explicitly type internal components as React.FC
const NotFound: React.FC = () => {
  return(
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are trying to access does not exist.</p>
      <a href="/">Back to Home</a>
    </div>
  )
}

const HomePage: React.FC = () => {
  return (
    <main className="app-container">
      <nav className="profile-nav">
        <Link to="/profile" aria-label="View My Profile">View My Profile</Link>
      </nav>
      <UploadTodo />
      <hr className="section-divider" />
      <ListOfTodos />
    </main>
  )
}

const LoadingSpinner: React.FC = () => (
  <div className="app-container">
    <p>Loading page...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/test-error" element={<TestErrorBoundary />}/>
            
            <Route element={<ProtectedRoute/>}>
              <Route path="/" element={<HomePage />}/>
              <Route path="/tasks/:id" element={<TodoDetails />}/>
              <Route path="/profile" element={<Profile />}/>
            </Route>
            
            <Route path="*" element={<NotFound />}/>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}

export default App;