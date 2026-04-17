import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

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
    return <div className="container mt-4">Loading job details...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{job.company}</h2>
        <Link to="/jobs" className="btn btn-secondary">
          Back to Jobs
        </Link>
      </div>

      <div className="card p-4 shadow-sm">
        <p>
          <strong>Role:</strong> {job.role}
        </p>
        <p>
          <strong>Status:</strong> {job.status}
        </p>
        <p>
          <strong>Job Type:</strong> {job.jobType}
        </p>
        <p>
          <strong>Location:</strong> {job.location || "Not added"}
        </p>
        <p>
          <strong>Salary:</strong> {job.salary || "Not added"}
        </p>
        <p>
          <strong>Source:</strong> {job.source || "Not added"}
        </p>
        <p>
          <strong>Applied Date:</strong>{" "}
          {job.appliedDate ? job.appliedDate.split("T")[0] : "Not added"}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {job.deadline ? job.deadline.split("T")[0] : "Not added"}
        </p>
        <p>
          <strong>Notes:</strong> {job.notes || "No notes added"}
        </p>

        <div className="mt-3">
          {job.jobLink ? (
            <a
              href={job.jobLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary"
            >
              Open Job Link
            </a>
          ) : (
            <span className="text-muted">No job link added</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
