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

  if (loading) {
    return <div className="container mt-4">Loading jobs...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2>Your Job Applications</h2>
            <a href="/jobs/add" className="btn btn-primary">
              Add Job
           </a>
       </div>

       <div className="mb-4">
         <input
           type="text"
           className="form-control"
           placeholder="Search by company or role..."
           value={searchTerm}
           onChange={(event) => setSearchTerm(event.target.value)}
          />
       </div>

       <div className="mb-4">
             <select
                className="form-select"
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

              <div className="mb-4">
                   <select
                       className="form-select"
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

             <div className="mb-4">
  <select
    className="form-select"
    value={sortOrder}
    onChange={(event) => setSortOrder(event.target.value)}
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>
</div>



       {filteredJobs.length === 0 ? (
        <div className="alert alert-info">
          No job applications found. Add your first job.
        </div>
       ) : (
        <div className="row">
          {filteredJobs.map((job) => (
            <div className="col-md-6 mb-3" key={job._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{job.company}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{job.role}</h6>

                  <p className="mb-1">
                    <strong>Status:</strong> {job.status}
                  </p>

                  <p className="mb-1">
                    <strong>Type:</strong> {job.jobType}
                  </p>

                  <p className="mb-1">
                    <strong>Location:</strong> {job.location || "Not added"}
                  </p>

                  <p className="mb-1">
                    <strong>Source:</strong> {job.source || "Not added"}
                  </p>

                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn btn-sm btn-info"
                    >
                      View Details
                    </Link>

                    {job.jobLink && (
                      <a
                        href={job.jobLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Link
                      </a>
                    )}

                    <Link
                      to={`/jobs/edit/${job._id}`}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-sm btn-danger"
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
