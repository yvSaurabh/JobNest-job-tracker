import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const normalizeStatus = (status) =>
  typeof status === "string" ? status.trim().toLowerCase() : "";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    jobType: "Full-time",
    status: "applied",
    jobLink: "",
    appliedDate: "",
    deadline: "",
    salary: "",
    source: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        const job = response.data.data;

        setFormData({
          company: job.company || "",
          role: job.role || "",
          location: job.location || "",
          jobType: job.jobType || "Full-time",
          status: normalizeStatus(job.status) || "applied",
          jobLink: job.jobLink || "",
          appliedDate: job.appliedDate ? job.appliedDate.split("T")[0] : "",
          deadline: job.deadline ? job.deadline.split("T")[0] : "",
          salary: job.salary || "",
          source: job.source || "",
          notes: job.notes || "",
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load job.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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
      setError("Company and role are required.");
      setLoading(false);
      return;
    }

    try {
        await api.put(`/jobs/${id}`, formData);
        navigate("/jobs");
    } catch(error) {
        setError(error.response?.data?.message  || "Failed to update job.");
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
  return (
    <div className="container mt-4">
      <div className="alert alert-secondary">Loading job details...</div>
    </div>
  );
}


  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Edit Job Application</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Company</label>
          <input
            type="text"
            name="company"
            className="form-control"
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
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
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
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Job Link</label>
          <input
            type="url"
            name="jobLink"
            className="form-control"
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
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-warning w-100">
          Update Job
        </button>
      </form>
    </div>
  );
};

export default EditJob;
