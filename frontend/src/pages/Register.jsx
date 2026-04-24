import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../context/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [loading, setLoading] = useState(false);

  // Password strength validation helper
  const checkPasswordStrength = (password) => {
    if (!password) return null;

    const checks = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    
    if (passedChecks === 4) {
      return { strength: "strong", color: "success", message: "Strong password ✓" };
    } else if (passedChecks >= 3) {
      return { strength: "good", color: "info", message: "Good password" };
    } else if (passedChecks >= 2) {
      return { strength: "fair", color: "warning", message: "Fair password" };
    } else {
      return { strength: "weak", color: "danger", message: "Weak password" };
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if(!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", formData);
      login(response.data.data);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 auth-page" style={{ maxWidth: "1100px" }}>
      <div className="auth-shell auth-shell-register">
        <div className="auth-panel auth-panel-brand">
          <span className="auth-kicker">Welcome To JobNest</span>
          <h1 className="auth-brand-title">Build your job search system in one place.</h1>
          <p className="auth-brand-copy">
            Register once, track every application, and keep your progress,
            links, and deadlines organized from day one.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <span className="auth-feature-number">01</span>
              <div>
                <h3 className="auth-feature-title">Track Every Stage</h3>
                <p className="auth-feature-copy">
                  Follow your applications from applied to offer with clear status views.
                </p>
              </div>
            </div>
            <div className="auth-feature-card">
              <span className="auth-feature-number">02</span>
              <div>
                <h3 className="auth-feature-title">Stay Deadline Ready</h3>
                <p className="auth-feature-copy">
                  Keep important dates, source links, and notes together.
                </p>
              </div>
            </div>
            <div className="auth-feature-card">
              <span className="auth-feature-number">03</span>
              <div>
                <h3 className="auth-feature-title">See Your Progress</h3>
                <p className="auth-feature-copy">
                  Use dashboard insights to understand your response flow over time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-panel auth-panel-form">
          <div className="auth-form-header">
            <span className="auth-form-chip">Create Account</span>
            <h2 className="auth-form-title">Join JobNest</h2>
            <p className="auth-form-subtitle">
              Start managing your applications with a cleaner workflow.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="auth-field">
              <label className="form-label auth-label">
                Full Name <span className="auth-required">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-control auth-input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {passwordStrength && (
                <div className={`alert alert-${passwordStrength.color} py-2 mt-2 mb-0`} style={{ fontSize: "0.85rem" }}>
                  {passwordStrength.message}
                  <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                    • Min 8 characters: {formData.password.length >= 8 ? "✓" : "✗"}<br />
                    • Uppercase letter: {/[A-Z]/.test(formData.password) ? "✓" : "✗"}<br />
                    • Lowercase letter: {/[a-z]/.test(formData.password) ? "✓" : "✗"}<br />
                    • Number: {/\d/.test(formData.password) ? "✓" : "✗"}
                  </div>
                </div>
              )}
              <span className="auth-field-hint">Password must be at least 8 characters with uppercase, lowercase, and number.</span>
            </div>

            <button
              type="submit"
              className="btn jobnest-nav-btn jobnest-nav-btn-primary w-100 auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <span className="auth-footer-text">Already have an account?</span>
            <Link to="/login" className="auth-footer-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
