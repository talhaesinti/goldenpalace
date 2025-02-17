'use client';

import React from "react";
import { ErrorUI } from "@/components/ErrorUI";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    // Direkt sayfa yenilemesi yapalım
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (typeof fallback === "function") {
        return fallback(error, this.handleReset);
      }
      return (
        <ErrorUI
          title="Beklenmeyen Bir Hata!"
          message={error?.message || "Sayfa yüklenirken bir hata oluştu."}
          onRetry={this.handleReset}
        />
      );
    }

    return children;
  }
}
