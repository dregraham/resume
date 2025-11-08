import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can hook logging here
    // eslint-disable-next-line no-console
    console.error('Captured error boundary:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', background: '#f5f5f5', padding: '12px', borderRadius: '6px', overflowX: 'auto' }}>
            {String(this.state.error)}\n{this.state.info?.componentStack || ''}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;