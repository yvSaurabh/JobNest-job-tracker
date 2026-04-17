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
    return <div className="container mt-4">Loading dashboard...</div>;
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
          <div className="card border-primary shadow-sm p-3">
            <h5 className="text-primary">Total Applications</h5>
            <h3>{stats.total}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-secondary shadow-sm p-3">
            <h5 className="text-secondary">Applied</h5>
            <h3>{stats.applied}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-info shadow-sm p-3">
            <h5 className="text-info">Shortlisted</h5>
            <h3>{stats.shortlisted}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-warning shadow-sm p-3">
            <h5 className="text-warning">Interview</h5>
            <h3>{stats.interview}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-success shadow-sm p-3">
            <h5 className="text-success">Offer</h5>
            <h3>{stats.offer}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-danger shadow-sm p-3">
            <h5 className="text-danger">Rejected</h5>
            <h3>{stats.rejected}</h3>
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
