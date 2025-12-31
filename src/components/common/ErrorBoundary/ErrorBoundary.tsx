/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI matching the site theme
 */

import React, { Component, type ReactNode, type ErrorInfo } from 'react'
import { Link } from 'react-router-dom'
import styles from './ErrorBoundary.module.css'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary class component
 * Must be a class component as React error boundaries only work with class components
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Store error info in state
    this.setState({
      error,
      errorInfo,
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to log to an error reporting service
    if (import.meta.env.PROD) {
      // Example: log to error reporting service
      // errorReportingService.logError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI matching the site theme
      return (
        <section className={styles.container} aria-labelledby="error-title">
          <div className={styles.content}>
            {/* Decorative Forest Element */}
            <div className={styles.forestDecoration} aria-hidden="true">
              <svg viewBox="0 0 200 120" className={styles.treeSvg}>
                <path
                  d="M100 10 L130 50 L115 50 L140 90 L60 90 L85 50 L70 50 Z"
                  fill="currentColor"
                  opacity="0.3"
                />
                <rect x="95" y="90" width="10" height="20" fill="currentColor" opacity="0.4" />
                <path
                  d="M60 25 L80 55 L70 55 L90 85 L30 85 L50 55 L40 55 Z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <rect x="56" y="85" width="8" height="15" fill="currentColor" opacity="0.3" />
                <path
                  d="M150 30 L170 60 L160 60 L175 85 L125 85 L140 60 L130 60 Z"
                  fill="currentColor"
                  opacity="0.25"
                />
                <rect x="147" y="85" width="7" height="12" fill="currentColor" opacity="0.35" />
              </svg>
            </div>

            {/* Error Icon */}
            <div className={styles.errorIcon} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="64"
                height="64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Error Title */}
            <h1 id="error-title" className={styles.title}>
              Something Went Wrong
            </h1>

            {/* Error Message */}
            <p className={styles.description}>
              We encountered an unexpected error while loading this page.
              <br />
              Don't worry, our team has been notified and we're working to fix it.
            </p>

            {/* Navigation Options */}
            <nav className={styles.navigation} aria-label="Error page navigation">
              <button onClick={this.handleReset} className={styles.primaryButton}>
                <span>Try Again</span>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
              </button>

              <Link to="/" className={styles.secondaryButton}>
                <span>Return Home</span>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            </nav>

            {/* Helpful Links */}
            <div className={styles.helpfulLinks}>
              <p className={styles.helpfulText}>Or try visiting:</p>
              <ul className={styles.linkList}>
                <li>
                  <Link to="/people-for-the-planet">People for the Planet</Link>
                </li>
                <li>
                  <Link to="/business-for-the-planet">Business for the Planet</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <p className={styles.support}>
              Need help? Contact us at{' '}
              <a href="mailto:connect@sacredgroves.earth">connect@sacredgroves.earth</a>
            </p>

            {/* Error Details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <details className={styles.errorDetails}>
                <summary className={styles.errorSummary}>Error Details (Development Only)</summary>
                <div className={styles.errorContent}>
                  <pre className={styles.errorStack}>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

