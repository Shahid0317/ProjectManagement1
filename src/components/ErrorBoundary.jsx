import React from 'react';
import ErrorPage from './ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical System Protocol Failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // If the error boundary is wrapping a small component, we might want a mini version,
      // but for now, we provide the full premium recovery screen.
      return (
        <ErrorPage 
          type="500" 
          message={this.state.error?.message || "An unexpected system breach has occurred."} 
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
