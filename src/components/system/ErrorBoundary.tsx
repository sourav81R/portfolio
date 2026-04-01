import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portfolio error boundary caught an error', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 px-4 py-24 text-white">
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">System Recovery</p>
            <h1 className="mt-4 text-3xl font-bold">Something went wrong.</h1>
            <p className="mt-4 text-sm text-slate-300 sm:text-base">
              The portfolio hit an unexpected error. Refresh the page to retry.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Reload application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
