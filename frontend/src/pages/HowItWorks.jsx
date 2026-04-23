import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import howHeroIllustration from "../assets/how-hero-illustration.svg";
import howBenefitsIllustration from "../assets/how-benefits-illustration.svg";

const HowItWorks = () => {
  const { user } = useAuth();

  const steps = [
    {
      number: "01",
      title: "Add Every Opportunity",
      tone: "how-step-card-blue",
      description:
        "Capture company, role, source, dates, and notes the moment you apply so nothing gets lost.",
    },
    {
      number: "02",
      title: "Track The Real Status",
      tone: "how-step-card-amber",
      description:
        "Move jobs across stages like Applied, Shortlisted, Interview, Offer, and Rejected as your search evolves.",
    },
    {
      number: "03",
      title: "Review And Improve",
      tone: "how-step-card-green",
      description:
        "Use the dashboard to understand your recent activity, response patterns, and current pipeline health.",
    },
  ];

  const benefits = [
    "Keeps all applications in one organized workspace",
    "Makes deadlines, sources, and job links easier to revisit",
    "Reduces the mental load of tracking applications manually",
    "Helps you spot progress instead of guessing how the search is going",
  ];

  return (
    <div className="container py-4 how-page" style={{ maxWidth: "1120px" }}>
      <section className="how-hero">
        <div className="how-hero-copy">
          <span className="how-kicker">About JobNest</span>
          <h1 className="how-title">A focused home for your job search.</h1>
          <p className="how-subtitle">
            JobNest is built to make job hunting feel less scattered. Instead of
            juggling screenshots, spreadsheets, browser tabs, and memory, you get
            one clear system for tracking where you applied, what happened next,
            and what deserves attention now.
          </p>
          <div className="how-hero-actions">
            {user ? (
              <>
                <Link to="/" className="btn jobnest-nav-btn jobnest-nav-btn-primary">
                  Open Dashboard
                </Link>
                <Link to="/jobs/add" className="btn jobnest-nav-btn jobnest-nav-btn-outline">
                  Add Your Next Job
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn jobnest-nav-btn jobnest-nav-btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn jobnest-nav-btn jobnest-nav-btn-outline">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="how-hero-panel">
          <div className="how-hero-image-wrap">
            <img
              src={howHeroIllustration}
              alt="Illustration showing a JobNest dashboard and job tracking cards"
              className="how-hero-image"
            />
          </div>
          <div className="how-metric-card">
            <span className="how-metric-label">Purpose</span>
            <strong className="how-metric-value">Clarity</strong>
            <p className="how-metric-copy">
              Turn a messy job search into a trackable process.
            </p>
          </div>
          <div className="how-metric-card">
            <span className="how-metric-label">Ambition</span>
            <strong className="how-metric-value">Momentum</strong>
            <p className="how-metric-copy">
              Help users stay consistent, reflective, and confident while applying.
            </p>
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="how-section-heading">
          <span className="how-section-chip">How It Works</span>
          <h2 className="how-section-title">Three simple steps</h2>
        </div>

        <div className="how-steps-grid">
          {steps.map((step) => (
            <article key={step.number} className={`how-step-card ${step.tone}`}>
              <span className="how-step-number">{step.number}</span>
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-copy">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div className="how-content-grid">
          <article className="how-story-card">
            <span className="how-section-chip">Why Use It</span>
            <h2 className="how-section-title">Benefits of using JobNest</h2>
            <div className="how-story-image-wrap">
              <img
                src={howBenefitsIllustration}
                alt="Illustration of organized job application tracking"
                className="how-story-image"
              />
            </div>
            <div className="how-benefits-list">
              {benefits.map((benefit) => (
                <div key={benefit} className="how-benefit-item">
                  <span className="how-benefit-mark" aria-hidden="true">
                    +
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="how-story-card how-story-card-accent">
            <span className="how-section-chip">Ambition</span>
            <h2 className="how-section-title">What JobNest aims to become</h2>
            <p className="how-story-copy">
              JobNest is not just a place to save jobs. Its ambition is to become
              a calm, reliable control center for your search, where every action,
              result, and next step is visible enough to help you improve over time.
            </p>
            <p className="how-story-copy">
              The goal is simple: fewer missed opportunities, less confusion, and
              better decisions through clearer tracking.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
