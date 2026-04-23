import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../context/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if(!formData.email.trim() || !formData.password.trim()) {
      setError("Email and Password are required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", formData);
      login(response.data.data);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 auth-page" style={{ maxWidth: "1100px" }}>
      <div className="auth-shell auth-shell-login">
        <div className="auth-panel auth-panel-brand">
          <span className="auth-kicker">Welcome Back</span>
          <h1 className="auth-brand-title">Pick up your job search right where you left it.</h1>
          <p className="auth-brand-copy">
            Sign in to review your pipeline, update statuses, and stay on top of
            interviews, offers, and deadlines.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <span className="auth-feature-number">01</span>
              <div>
                <h3 className="auth-feature-title">Review Your Pipeline</h3>
                <p className="auth-feature-copy">
                  See every active application and quickly understand what needs attention.
                </p>
              </div>
            </div>
            <div className="auth-feature-card">
              <span className="auth-feature-number">02</span>
              <div>
                <h3 className="auth-feature-title">Update Progress Fast</h3>
                <p className="auth-feature-copy">
                  Move roles across stages without losing notes, links, or dates.
                </p>
              </div>
            </div>
            <div className="auth-feature-card">
              <span className="auth-feature-number">03</span>
              <div>
                <h3 className="auth-feature-title">Keep Momentum Visible</h3>
                <p className="auth-feature-copy">
                  Use the dashboard to spot your response patterns and recent activity.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-panel auth-panel-form">
          <div className="auth-form-header">
            <span className="auth-form-chip">Sign In</span>
            <h2 className="auth-form-title">Login to JobNest</h2>
            <p className="auth-form-subtitle">
              Continue managing your applications and progress.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="auth-field">
              <label className="form-label auth-label">
                Email Address <span className="auth-required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="form-control auth-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="form-label auth-label">
                Password <span className="auth-required">*</span>
              </label>
              <input
                type="password"
                name="password"
                className="form-control auth-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn jobnest-nav-btn jobnest-nav-btn-success w-100 auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <span className="auth-footer-text">New to JobNest?</span>
            <Link to="/register" className="auth-footer-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
