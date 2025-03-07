import type React from "react"

interface LoadingSpinnerProps {
  fullPage?: boolean
  size?: "small" | "medium" | "large"
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullPage = false, size = "medium" }) => {
  const sizeClass = size === "small" ? "loading-spinner-small" : size === "large" ? "loading-spinner-large" : ""

  const containerClass = fullPage ? "page-spinner" : "loading-container"

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${sizeClass}`}></div>
    </div>
  )
}

export default LoadingSpinner