import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import JobDetails from "./pages/JobDetails";
import HowItWorks from "./pages/HowItWorks";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import useAuth from "./context/useAuth";

const AppLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg px-3 py-3 jobnest-navbar">
        <div className="container-fluid d-flex flex-wrap justify-content-between gap-2 align-items-center">
          <Link to="/" className="navbar-brand fw-bold jobnest-navbar-brand">
            <span className="jobnest-logo-mark" aria-hidden="true">
              JN
            </span>
            JobNest
          </Link>

          <div className="d-flex flex-wrap gap-2 align-items-center jobnest-navbar-actions">
            <Link to="/" className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-outline">
              Dashboard
            </Link>

            <Link to="/jobs" className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-outline">
              Jobs
            </Link>

            <Link to="/how-it-works" className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-guide">
              How It Works
            </Link>

            <Link to="/jobs/add" className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-primary">
              Add Job
            </Link>

            {!user ? (
              <>
                <Link to="/login" className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-success">
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-danger"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="jobnest-main-content">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/add"
            element={
              <ProtectedRoute>
                <AddJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/edit/:id"
            element={
              <ProtectedRoute>
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
