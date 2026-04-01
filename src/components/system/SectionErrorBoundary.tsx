import { Component, type ErrorInfo, type ReactNode } from 'react'

type SectionErrorBoundaryProps = {
  children: ReactNode
  title: string
}

type SectionErrorBoundaryState = {
  hasError: boolean
}

class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Section error boundary caught an error in ${this.props.title}`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
              Section Recovery
            </p>
            <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
              {this.props.title} could not render
            </h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              The rest of the portfolio is still available. Refresh if you want to retry this section.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default SectionErrorBoundary
