import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../services/api";

const DashboardChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="dashboard-chart-tooltip">
      {label ? <p className="dashboard-chart-tooltip-label">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.name} className="dashboard-chart-tooltip-value">
          <span
            className="dashboard-chart-tooltip-dot"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    shortlisted: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, jobsResponse] = await Promise.all([
          api.get("/jobs/stats/summary"),
          api.get("/jobs"),
        ]);

        setStats(statsResponse.data.data);
        setJobs(jobsResponse.data.data);
        setRecentJobs(jobsResponse.data.data.slice(0, 5));
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Total Applications",
      value: stats.total,
      background: "#dbeafe",
      border: "#2563eb",
      text: "#1e40af",
    },
    {
      label: "Applied",
      value: stats.applied,
      background: "#e2e8f0",
      border: "#475569",
      text: "#1f2937",
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted,
      background: "#cffafe",
      border: "#0891b2",
      text: "#155e75",
    },
    {
      label: "Interview",
      value: stats.interview,
      background: "#fde68a",
      border: "#d97706",
      text: "#92400e",
    },
    {
      label: "Offer",
      value: stats.offer,
      background: "#bbf7d0",
      border: "#16a34a",
      text: "#166534",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      background: "#fecaca",
      border: "#dc2626",
      text: "#991b1b",
    },
  ];

  const statusChartData = [
    {
      name: "Applied",
      value: stats.applied,
      color: "#64748b",
      light: "#e2e8f0",
    },
    {
      name: "Shortlisted",
      value: stats.shortlisted,
      color: "#0891b2",
      light: "#cffafe",
    },
    {
      name: "Interview",
      value: stats.interview,
      color: "#d97706",
      light: "#fde68a",
    },
    {
      name: "Offer",
      value: stats.offer,
      color: "#16a34a",
      light: "#bbf7d0",
    },
    {
      name: "Rejected",
      value: stats.rejected,
      color: "#dc2626",
      light: "#fecaca",
    },
  ];

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const recentWindowStart = new Date(today.getTime() - 44 * DAY_IN_MS);
  recentWindowStart.setHours(0, 0, 0, 0);

  const previousWindowStart = new Date(recentWindowStart.getTime() - 45 * DAY_IN_MS);
  previousWindowStart.setHours(0, 0, 0, 0);

  const previousWindowEnd = new Date(recentWindowStart.getTime() - DAY_IN_MS);
  previousWindowEnd.setHours(23, 59, 59, 999);

  const getActivityDate = (job) => {
    const rawDate = job.appliedDate || job.createdAt;
    const parsedDate = new Date(rawDate);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const recent45DayJobs = jobs.filter((job) => {
    const sourceDate = getActivityDate(job);

    return sourceDate && sourceDate >= recentWindowStart && sourceDate <= today;
  });

  const previous45DayJobs = jobs.filter((job) => {
    const sourceDate = getActivityDate(job);

    return sourceDate && sourceDate >= previousWindowStart && sourceDate <= previousWindowEnd;
  });

  const activityChartData = Array.from({ length: 9 }, (_, index) => {
    const bucketStart = new Date(recentWindowStart.getTime() + index * 5 * DAY_IN_MS);
    const bucketEnd = new Date(
      Math.min(bucketStart.getTime() + 4 * DAY_IN_MS, today.getTime())
    );

    const applications = recent45DayJobs.filter((job) => {
      const sourceDate = getActivityDate(job);

      return sourceDate && sourceDate >= bucketStart && sourceDate <= bucketEnd;
    }).length;

    const sameMonth = bucketStart.getMonth() === bucketEnd.getMonth();
    const label = sameMonth
      ? `${bucketStart.toLocaleString("en-US", {
          month: "short",
        })} ${bucketStart.getDate()}-${bucketEnd.getDate()}`
      : `${bucketStart.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        })}-${bucketEnd.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        })}`;

    return {
      label,
      applications,
    };
  });

  const recent45DayCount = recent45DayJobs.length;
  const recent45DayProgressCount = recent45DayJobs.filter((job) =>
    ["Shortlisted", "Interview", "Offer"].includes(job.status)
  ).length;
  const recent45DayResponseRate = recent45DayCount
    ? Math.round((recent45DayProgressCount / recent45DayCount) * 100)
    : 0;
  const trendPercentage = previous45DayJobs.length
    ? Math.round(
        ((recent45DayCount - previous45DayJobs.length) / previous45DayJobs.length) * 100
      )
    : recent45DayCount > 0
      ? 100
      : 0;
  const trendPrefix = trendPercentage > 0 ? "+" : "";

  const getStatusStyles = (status) => {
    const styles = {
      Applied: {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      },
      Shortlisted: {
        backgroundColor: "#cffafe",
        color: "#0f766e",
      },
      Interview: {
        backgroundColor: "#fde68a",
        color: "#92400e",
      },
      Offer: {
        backgroundColor: "#bbf7d0",
        color: "#166534",
      },
      Rejected: {
        backgroundColor: "#fecaca",
        color: "#991b1b",
      },
    };

    return (
      styles[status] || {
        backgroundColor: "#e5e7eb",
        color: "#374151",
      }
    );
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-secondary">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="dashboard-hero-copy">
          <h2 className="mb-1 dashboard-hero-title">Job Dashboard</h2>
          <p className="mb-0 dashboard-hero-subtitle">
            Track your applications across every stage.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Link to="/jobs/add" className="btn btn-primary">
            Add New Job
          </Link>
          <Link to="/jobs" className="btn btn-outline-secondary">
            View All Jobs
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-5">
        {statCards.map((card) => (
          <div className="col-md-4" key={card.label}>
            <div
              className="card h-100 p-3 dashboard-stat-card"
              style={{
                backgroundColor: card.background,
                borderColor: card.border,
                borderWidth: "1px",
              }}
            >
              <p className="mb-2 dashboard-stat-label" style={{ color: card.text }}>
                {card.label}
              </p>
              <h2 className="mb-0 dashboard-stat-value" style={{ color: card.text }}>
                {card.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-5">
        <div className="col-lg-5">
          <div className="card border-0 dashboard-chart-card h-100">
            <div className="card-body p-4">
              <div className="dashboard-chart-header">
                <div>
                  <h4 className="mb-1">Status Breakdown</h4>
                  <p className="dashboard-chart-subtitle">
                    See how your applications are spread across each stage.
                  </p>
                </div>
              </div>

              {stats.total === 0 ? (
                <div className="dashboard-chart-empty">
                  Add your first job to unlock the status charts.
                </div>
              ) : (
                <>
                  <div className="dashboard-donut-shell">
                    <div className="dashboard-donut-center">
                      <span>Total</span>
                      <strong>{stats.total}</strong>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={74}
                          outerRadius={108}
                          paddingAngle={3}
                          stroke="rgba(255,255,255,0.85)"
                          strokeWidth={4}
                        >
                          {statusChartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<DashboardChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="dashboard-chart-legend">
                    {statusChartData.map((item) => (
                      <div className="dashboard-chart-legend-item" key={item.name}>
                        <div className="dashboard-chart-legend-copy">
                          <span
                            className="dashboard-chart-legend-swatch"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="dashboard-chart-legend-label">
                            {item.name}
                          </span>
                        </div>
                        <span
                          className="dashboard-chart-legend-value"
                          style={{ backgroundColor: item.light, color: item.color }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 dashboard-chart-card h-100">
            <div className="card-body p-4">
              <div className="dashboard-chart-header">
                <div>
                  <h4 className="mb-1">Application Activity</h4>
                  <p className="dashboard-chart-subtitle">
                    Track your application flow from the last 45 days in 5-day blocks.
                  </p>
                </div>
              </div>

              <div className="dashboard-bar-shell">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={activityChartData} margin={{ left: -10, right: 8 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#dbeafe" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <Tooltip content={<DashboardChartTooltip />} />
                    <Bar
                      dataKey="applications"
                      name="Applications"
                      radius={[10, 10, 0, 0]}
                      fill="#2563eb"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

                <div className="dashboard-chart-summary">
                  <div className="dashboard-chart-summary-item">
                    <span className="dashboard-chart-summary-label">Last 45 Days</span>
                    <strong className="dashboard-chart-summary-value">
                      {recent45DayCount}
                    </strong>
                  </div>
                  <div className="dashboard-chart-summary-item">
                    <span className="dashboard-chart-summary-label">Vs Prev 45 Days</span>
                    <strong className="dashboard-chart-summary-value">
                      {trendPrefix}
                      {trendPercentage}%
                    </strong>
                  </div>
                  <div className="dashboard-chart-summary-item">
                    <span className="dashboard-chart-summary-label">Progressed</span>
                    <strong className="dashboard-chart-summary-value">
                      {recent45DayProgressCount} ({recent45DayResponseRate}%)
                    </strong>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 dashboard-recent-card">
        <div className="card-body p-4 p-md-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="mb-1">Recent Applications</h4>
              <p className="text-muted mb-0">
                Your latest tracked applications and their current progress.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-outline">
              See All
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="alert alert-info mb-0 dashboard-recent-empty">
              No recent jobs found. Add your first application to start tracking.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0 dashboard-recent-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Source</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job._id} className="dashboard-recent-row">
                      <td className="fw-semibold text-dark">{job.company}</td>
                      <td className="text-muted">{job.role}</td>
                      <td>
                        <span
                          className="dashboard-status-badge"
                          style={getStatusStyles(job.status)}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="text-muted">{job.source || "Not added"}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="btn btn-sm jobnest-nav-btn jobnest-nav-btn-outline"
                          >
                            Details
                          </Link>
                          <Link
                            to={`/jobs/edit/${job._id}`}
                            className="btn btn-sm dashboard-action-btn-warning"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
