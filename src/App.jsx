import React from "react";
import { lazy, Suspense } from "react";
import ListOfTodos from "./ListOfTodos";
import UploadTodo from "./UploadTodo";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import TestErrorBoundary from "./TestErrorBoundary";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Signup from "./Signup";
import "./index.css";
import "./App.css";
const TodoDetails = lazy(() => import("./TodoDetails"));//this loads a particular task details page only when it's needed, which makes this app faster to load.
const Profile = lazy(() => import("./Profile"));

const NotFound = () => {
  return(
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are trying to access does not exist.</p>
      <a href="/">Back to Home</a>
    </div>
  )
}

const HomePage = () => {
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

// I created a simple loading component to show while loading.
const LoadingSpinner = () => (
  <div className="app-container">
    <p>Loading page...</p>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/test-error" element={<TestErrorBoundary />}/>
            <Route element={<ProtectedRoute/>}>{/* This makes the routes wrapped in this route protected from other users */}
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