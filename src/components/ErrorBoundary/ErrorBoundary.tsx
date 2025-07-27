import React from 'react';
import './ErrorBoundary.css';
import type { ErrorBoundaryState } from '../../types/errorBoundary.types';

interface ErrorBoundaryProps {
  children?: React.ReactNode; // Делаем children опциональным
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorInfo: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorInfo: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h3>Something went wrong</h3>
            <p>{this.state.errorInfo || 'An unexpected error occurred.'}</p>
            <button onClick={this.handleReset} className="error-button">
              Try to recover
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
