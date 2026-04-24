import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const normalizeStatus = (status) =>
  typeof status === "string" ? status.trim().toLowerCase() : "";
const formatStatusLabel = (status) => {
  const normalizedStatus = normalizeStatus(status);
  return normalizedStatus
    ? normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)
    : "Unknown";
};

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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
    <div className="container py-4" style={{ maxWidth: "860px" }}>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="job-details-header-copy">
          <h2 className="mb-1 job-details-title">{job.company}</h2>
          <p className="job-details-subtitle mb-0">{job.role}</p>
        </div>
        <Link to="/jobs" className="btn jobnest-nav-btn jobnest-nav-btn-outline">
          Back to Jobs
        </Link>
      </div>

      <div className="card border-0 job-details-card">
        <div className="card-body px-4 py-3 px-md-5 py-md-4">
          <div className="job-details-grid">
            <div className="job-details-item">
              <span className="job-details-label">Status</span>
              <span className="job-details-value">{formatStatusLabel(job.status)}</span>
            </div>
            <div className="job-details-item">
              <span className="job-details-label">Job Type</span>
              <span className="job-details-value">{job.jobType}</span>
            </div>
            <div className="job-details-item">
              <span className="job-details-label">Location</span>
              <span className="job-details-value">{job.location || "Not added"}</span>
            </div>
            <div className="job-details-item">
              <span className="job-details-label">Salary</span>
              <span className="job-details-value">{job.salary || "Not added"}</span>
            </div>
            <div className="job-details-item">
              <span className="job-details-label">Source</span>
              <span className="job-details-value">{job.source || "Not added"}</span>
            </div>
            <div className="job-details-item">
              <span className="job-details-label">Applied Date</span>
              <span className="job-details-value">
                {job.appliedDate ? job.appliedDate.split("T")[0] : "Not added"}
              </span>
            </div>
            <div className="job-details-item">
              <span className="job-details-label">Deadline</span>
              <span className="job-details-value">
                {job.deadline ? job.deadline.split("T")[0] : "Not added"}
              </span>
            </div>
          </div>

          <div className="job-details-notes">
            <span className="job-details-label">Notes</span>
            <p className="job-details-notes-text mb-0">
              {job.notes || "No notes added"}
            </p>
          </div>

          <div className="job-details-actions">
          {job.jobLink ? (
            <a
              href={job.jobLink}
              target="_blank"
              rel="noreferrer"
              className="btn jobnest-nav-btn jobnest-nav-btn-primary"
            >
              Open Job Link
            </a>
          ) : (
            <span className="text-muted">No job link added</span>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
