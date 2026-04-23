import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== jobId)
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete job.");
    }
  };

  const filteredJobs = jobs
    .filter((job) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        job.company.toLowerCase().includes(search) ||
        job.role.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "" || job.status === statusFilter;

      const matchesJobType =
        jobTypeFilter === "" || job.jobType === jobTypeFilter;

      return matchesSearch && matchesStatus && matchesJobType;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const getStatusStyles = (status) => {
    const styles = {
      Applied: {
        backgroundColor: "#2563eb",
        color: "#ffffff",
        borderColor: "#2563eb",
      },
      Shortlisted: {
        backgroundColor: "#0891b2",
        color: "#ffffff",
        borderColor: "#0891b2",
      },
      Interview: {
        backgroundColor: "#d97706",
        color: "#ffffff",
        borderColor: "#d97706",
      },
      Offer: {
        backgroundColor: "#16a34a",
        color: "#ffffff",
        borderColor: "#16a34a",
      },
      Rejected: {
        backgroundColor: "#dc2626",
        color: "#ffffff",
        borderColor: "#dc2626",
      },
    };

    return (
      styles[status] || {
        backgroundColor: "#475569",
        color: "#ffffff",
        borderColor: "#475569",
      }
    );
  };

  const getCardStatusStyles = (status) => {
    const styles = {
      Applied: {
        backgroundColor: "#dbeafe",
        borderColor: "rgba(37, 99, 235, 0.24)",
        boxShadow: "0 18px 36px rgba(37, 99, 235, 0.14)",
      },
      Shortlisted: {
        backgroundColor: "#cffafe",
        borderColor: "rgba(13, 148, 136, 0.24)",
        boxShadow: "0 18px 36px rgba(13, 148, 136, 0.14)",
      },
      Interview: {
        backgroundColor: "#fde68a",
        borderColor: "rgba(217, 119, 6, 0.24)",
        boxShadow: "0 18px 36px rgba(217, 119, 6, 0.14)",
      },
      Offer: {
        backgroundColor: "#bbf7d0",
        borderColor: "rgba(22, 163, 74, 0.24)",
        boxShadow: "0 18px 36px rgba(22, 163, 74, 0.14)",
      },
      Rejected: {
        backgroundColor: "#fecaca",
        borderColor: "rgba(220, 38, 38, 0.24)",
        boxShadow: "0 18px 36px rgba(220, 38, 38, 0.14)",
      },
    };

    return (
      styles[status] || {
        backgroundColor: "#e2e8f0",
        borderColor: "rgba(148, 163, 184, 0.2)",
        boxShadow: "0 16px 32px rgba(15, 23, 42, 0.12)",
      }
    );
  };

  const getJobTypeStyles = (jobType) => {
    const styles = {
      "Full-time": {
        backgroundColor: "#eff6ff",
        color: "#1e40af",
      },
      "Part-time": {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      },
      Internship: {
        backgroundColor: "#ede9fe",
        color: "#6d28d9",
      },
      Contract: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
      },
      Remote: {
        backgroundColor: "#dcfce7",
        color: "#166534",
      },
    };

    return (
      styles[jobType] || {
        backgroundColor: "#f1f5f9",
        color: "#334155",
      }
    );
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-secondary">Loading your job applications...</div>
      </div>
    );
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Your Job Applications</h2>
        <Link to="/jobs/add" className="btn btn-primary">
          Add Job
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control jobs-filter-control"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select jobs-filter-control jobs-filter-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select jobs-filter-control jobs-filter-select"
            value={jobTypeFilter}
            onChange={(event) => setJobTypeFilter(event.target.value)}
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-select jobs-filter-control jobs-filter-select"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="card border-0 shadow-sm p-4 text-center jobs-empty-state">
          <h5 className="mb-2">No matching job applications</h5>
          <p className="text-muted mb-3">
            Try changing your search or filters, or add a new job application.
          </p>
          <Link to="/jobs/add" className="btn btn-primary">
            Add Job
          </Link>
        </div>
      ) : (
        <div className="row g-3 jobs-grid">
          {filteredJobs.map((job) => (
            <div className="col-sm-6 col-xl-4" key={job._id}>
              <div
                className="card h-100 border-0 jobs-card"
                style={getCardStatusStyles(job.status)}
              >
                <div className="card-body jobs-card-body">
                  <div className="jobs-card-header">
                    <div className="jobs-card-copy">
                      <h5 className="mb-1 jobs-card-title">{job.company}</h5>
                      <p className="mb-0 jobs-card-role">{job.role}</p>
                    </div>
                    <span
                      className="jobs-status-badge"
                      style={getStatusStyles(job.status)}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="jobs-card-chips">
                    <span
                      className="jobs-type-badge"
                      style={getJobTypeStyles(job.jobType)}
                    >
                      {job.jobType}
                    </span>
                    <span className="jobs-neutral-badge">
                      {job.location || "Location pending"}
                    </span>
                  </div>

                  <div className="jobs-card-grid">
                    <div className="jobs-card-meta">
                      <span className="jobs-card-label">Source</span>
                      <span className="jobs-card-value">{job.source || "Not added"}</span>
                    </div>
                    <div className="jobs-card-meta">
                      <span className="jobs-card-label">Added</span>
                      <span className="jobs-card-value">
                        {job.createdAt ? job.createdAt.split("T")[0] : "Not added"}
                      </span>
                    </div>
                  </div>

                  <div className="jobs-card-actions">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-outline"
                    >
                      Details
                    </Link>

                    {job.jobLink && (
                      <a
                        href={job.jobLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-primary"
                      >
                        Link
                      </a>
                    )}

                    <Link
                      to={`/jobs/edit/${job._id}`}
                      className="btn btn-sm dashboard-action-btn-warning"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="btn btn-sm jobs-delete-btn"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
