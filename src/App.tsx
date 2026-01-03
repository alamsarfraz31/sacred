/**
 * App Component
 * Main application component with HelmetProvider and ErrorBoundary
 */

import { HelmetProvider } from 'react-helmet-async'
import { Routes } from '@/routes'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

/**
 * Root application component
 * @returns App JSX element
 */
function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Routes />
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App
