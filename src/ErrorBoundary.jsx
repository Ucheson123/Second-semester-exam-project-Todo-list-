import React from "react";

// To be quick, I just copied the ErrorBoundary code from the Blog Assignment since it's a boiler plate code.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Oh, the code crashed!", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something Went Wrong</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
