import * as React from "react"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"

type AppErrorBoundaryProps = {
  children: React.ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  handleRetry = () => {
    this.setState({ hasError: false })
    window.location.assign(window.location.href)
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackScreen
          title="Something went wrong."
          description="An unexpected error occurred. Please try again."
          action={
            <FallbackActions
              homeHref="/"
              homeLabel="Go home"
              retryLabel="Try again"
              onRetry={this.handleRetry}
            />
          }
        />
      )
    }

    return this.props.children
  }
}
