import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const AddJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    jobType: "Full-time",
    status: "Applied",
    jobLink: "",
    appliedDate: "",
    deadline: "",
    salary: "",
    source: "",
    notes: "",
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

    if(!formData.company.trim() || !formData.role.trim()) {
      setError("Company and Role are required fields.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/jobs", formData);
      navigate("/jobs");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 add-job-page" style={{ maxWidth: "960px" }}>
      <div className="add-job-hero">
        <div className="add-job-hero-copy">
          <span className="add-job-kicker">JobNest Workspace</span>
          <h2 className="mb-2 add-job-title">Add New Job Application</h2>
        </div>
        <Link to="/jobs" className="btn jobnest-nav-btn jobnest-nav-btn-outline add-job-back-btn">
          Back to Jobs
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card border-0 add-job-form-card">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card-body p-4 p-md-5">
          <div className="add-job-section">
            <div className="add-job-section-header">
              <div>
                <h4 className="mb-1 add-job-section-title">Core Details</h4>
                <p className="add-job-section-subtitle">
                  Start with the company, role, and current status.
                </p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="add-job-field">
                  <label className="form-label add-job-label">
                    Company <span className="add-job-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    className="form-control add-job-input"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="add-job-field">
                  <label className="form-label add-job-label">
                    Role <span className="add-job-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    className="form-control add-job-input"
                    placeholder="Enter job role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="add-job-field">
                  <label className="form-label add-job-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control add-job-input"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="add-job-field">
                  <label className="form-label add-job-label">Job Type</label>
                  <select
                    name="jobType"
                    className="form-select add-job-input add-job-select"
                    value={formData.jobType}
                    onChange={handleChange}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>

              <div className="col-md-3">
                <div className="add-job-field">
                  <label className="form-label add-job-label">Status</label>
                  <select
                    name="status"
                    className="form-select add-job-input add-job-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option>Applied</option>
                    <option>Shortlisted</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="add-job-section">
            <div className="add-job-section-header">
              <div>
                <h4 className="mb-1 add-job-section-title">Timeline</h4>
                <p className="add-job-section-subtitle">
                  Add the application date and any upcoming deadline.
                </p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="add-job-field">
                  <label className="form-label add-job-label">Applied Date</label>
                  <input
                    type="date"
                    name="appliedDate"
                    className="form-control add-job-input"
                    value={formData.appliedDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="add-job-field">
                  <label className="form-label add-job-label">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    className="form-control add-job-input"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="add-job-section">
            <div className="add-job-section-header">
              <div>
                <h4 className="mb-1 add-job-section-title">Links And Notes</h4>
                <p className="add-job-section-subtitle">
                  Keep source, salary, and follow-up notes together.
                </p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <div className="add-job-field">
                  <label className="form-label add-job-label">Job Link</label>
                  <input
                    type="url"
                    name="jobLink"
                    className="form-control add-job-input"
                    placeholder="Paste job application link"
                    value={formData.jobLink}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="add-job-field">
                  <label className="form-label add-job-label">Salary</label>
                  <input
                    type="text"
                    name="salary"
                    className="form-control add-job-input"
                    placeholder="Enter salary or stipend"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="add-job-field">
                  <label className="form-label add-job-label">Source</label>
                  <input
                    type="text"
                    name="source"
                    className="form-control add-job-input"
                    placeholder="LinkedIn, Naukri, Indeed, Referral..."
                    value={formData.source}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="add-job-field">
                  <label className="form-label add-job-label">Notes</label>
                  <textarea
                    name="notes"
                    className="form-control add-job-input add-job-notes"
                    rows="4"
                    placeholder="Add any useful notes"
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="add-job-actions">
            <Link to="/jobs" className="btn jobnest-nav-btn jobnest-nav-btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn jobnest-nav-btn jobnest-nav-btn-primary add-job-submit-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Job"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddJob;
