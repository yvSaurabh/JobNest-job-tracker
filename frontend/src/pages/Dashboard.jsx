import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    shortlisted: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/jobs/stats/summary");
        setStats(response.data.data);

        const jobsResponse = await api.get("/jobs");
        setRecentJobs(jobsResponse.data.data.slice(0, 5));
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      <h2 className="mb-4">Job Dashboard</h2>
       <div className="d-flex gap-2 mb-4 flex-wrap">
          <Link to="/jobs/add" className="btn btn-primary">
               Add New Job
          </Link>
          <Link to="/jobs" className="btn btn-outline-secondary">
               View All Jobs
           </Link>
    
       </div>

                  <div className="row g-3">
        <div className="col-md-4">
          <div className="card border-primary shadow-sm h-100 p-3">
            <p className="text-muted mb-2">Total Applications</p>
            <h2 className="text-primary mb-0">{stats.total}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-secondary shadow-sm h-100 p-3">
            <p className="text-muted mb-2">Applied</p>
            <h2 className="mb-0">{stats.applied}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-info shadow-sm h-100 p-3">
            <p className="text-muted mb-2">Shortlisted</p>
            <h2 className="text-info mb-0">{stats.shortlisted}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-warning shadow-sm h-100 p-3">
            <p className="text-muted mb-2">Interview</p>
            <h2 className="text-warning mb-0">{stats.interview}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-success shadow-sm h-100 p-3">
            <p className="text-muted mb-2">Offer</p>
            <h2 className="text-success mb-0">{stats.offer}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-danger shadow-sm h-100 p-3">
            <p className="text-muted mb-2">Rejected</p>
            <h2 className="text-danger mb-0">{stats.rejected}</h2>
          </div>
        </div>
      </div>


      <div className="mt-5">
        <h4 className="mb-3">Recent Applications</h4>

        {recentJobs.length === 0 ? (
          <div className="alert alert-info">No recent jobs found.</div>
        ) : (
          <div className="list-group">
            {recentJobs.map((job) => (
              <div
                key={job._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{job.company}</h6>
                  <small>{job.role}</small>
                </div>
                <span className="badge bg-primary rounded-pill">
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
