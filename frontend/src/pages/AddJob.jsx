import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Add New Job Application</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Company</label>
          <input
            type="text"
            name="company"
            className="form-control"
            placeholder="Enter company name"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <input
            type="text"
            name="role"
            className="form-control"
            placeholder="Enter job role"
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Job Type</label>
          <select
            name="jobType"
            className="form-select"
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

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
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

        <div className="mb-3">
          <label className="form-label">Job Link</label>
          <input
            type="url"
            name="jobLink"
            className="form-control"
            placeholder="Paste job application link"
            value={formData.jobLink}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Applied Date</label>
          <input
            type="date"
            name="appliedDate"
            className="form-control"
            value={formData.appliedDate}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input
            type="date"
            name="deadline"
            className="form-control"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            type="text"
            name="salary"
            className="form-control"
            placeholder="Enter salary or stipend"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Source</label>
          <input
            type="text"
            name="source"
            className="form-control"
            placeholder="LinkedIn, Naukri, Indeed, Referral..."
            value={formData.source}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            className="form-control"
            rows="4"
            placeholder="Add any useful notes"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Saving..." : "Save Job"}
        </button>
      </form>
    </div>
  );
};

export default AddJob;
