import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5" style={{ minHeight: '100vh' }}>
          <div className="card border-danger shadow-sm">
            <div className="card-body p-5">
              <h2 className="card-title text-danger mb-3">
                <span>⚠️ Something went wrong</span>
              </h2>
              <p className="card-text text-muted mb-3">
                We encountered an unexpected error. Please try refreshing the page or going back to the dashboard.
              </p>
              
              {import.meta.env.DEV && (
                <div className="alert alert-warning mt-4">
                  <h5 className="alert-heading">Error Details (Development Only)</h5>
                  <pre style={{ fontSize: '0.85rem', maxHeight: '300px', overflow: 'auto' }}>
                    <code>{this.state.error && this.state.error.toString()}</code>
                  </pre>
                  {this.state.errorInfo && (
                    <pre style={{ fontSize: '0.85rem', maxHeight: '200px', overflow: 'auto' }}>
                      <code>{this.state.errorInfo.componentStack}</code>
                    </pre>
                  )}
                </div>
              )}

              <div className="mt-4 d-flex gap-2">
                <button 
                  onClick={this.handleReset}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
                <a 
                  href="/"
                  className="btn btn-outline-secondary"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
