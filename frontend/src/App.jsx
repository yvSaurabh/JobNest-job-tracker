import { useState } from "react";
import { Menu, X } from "lucide-react";
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

const NavigationLinks = ({ user, onNavigate, onLogout, variant = "desktop" }) => (
  <>
    <Link
      to="/"
      className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-outline"
      onClick={onNavigate}
    >
      Dashboard
    </Link>

    <Link
      to="/jobs"
      className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-outline"
      onClick={onNavigate}
    >
      Jobs
    </Link>

    <Link
      to="/how-it-works"
      className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-guide"
      onClick={onNavigate}
    >
      How It Works
    </Link>

    <Link
      to="/jobs/add"
      className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-primary"
      onClick={onNavigate}
    >
      Add Job
    </Link>

    {!user ? (
      <>
        <Link
          to="/login"
          className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-outline"
          onClick={onNavigate}
        >
          Login
        </Link>
        <Link
          to="/register"
          className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-success"
          onClick={onNavigate}
        >
          Register
        </Link>
      </>
    ) : (
      <button
        type="button"
        onClick={onLogout}
        className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-danger"
      >
        Logout
      </button>
    )}

    {variant === "mobile" ? <div className="jobnest-sidebar-footer">JobNest</div> : null}
  </>
);

const AppLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg px-3 py-3 jobnest-navbar">
        <div className="container-fluid d-flex justify-content-between gap-2 align-items-center">
          <Link to="/" className="navbar-brand fw-bold jobnest-navbar-brand" onClick={closeMenu}>
            <span className="jobnest-logo-mark" aria-hidden="true">
              JN
            </span>
            JobNest
          </Link>

          <div className="d-flex flex-wrap gap-2 align-items-center jobnest-navbar-actions">
            <NavigationLinks user={user} onNavigate={closeMenu} onLogout={handleLogout} />
          </div>

          <button
            type="button"
            className="jobnest-menu-toggle"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        className={`jobnest-sidebar-backdrop${isMenuOpen ? " is-open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <aside className={`jobnest-sidebar${isMenuOpen ? " is-open" : ""}`} aria-hidden={!isMenuOpen}>
        <div className="jobnest-sidebar-header">
          <Link to="/" className="jobnest-navbar-brand fw-bold" onClick={closeMenu}>
            <span className="jobnest-logo-mark" aria-hidden="true">
              JN
            </span>
            JobNest
          </Link>
          <button
            type="button"
            className="jobnest-sidebar-close"
            aria-label="Close navigation menu"
            onClick={closeMenu}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="jobnest-sidebar-actions">
          <NavigationLinks
            user={user}
            onNavigate={closeMenu}
            onLogout={handleLogout}
            variant="mobile"
          />
        </div>
      </aside>

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
