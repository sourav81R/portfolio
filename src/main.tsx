import { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/system/ErrorBoundary'
import './index.css'

const App = lazy(() => import('./App'))
const DashboardPage = lazy(() => import('./pages/DashboardView'))
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))

const savedTheme = localStorage.getItem('theme')

if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else if (savedTheme === 'light') {
  document.documentElement.classList.remove('dark')
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed', error)
      })
      return
    }

    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister()
      })
    })

    if ('caches' in window) {
      void caches.keys().then((keys) => {
        keys
          .filter((key) => key.startsWith('sourav-portfolio-'))
          .forEach((key) => {
            void caches.delete(key)
          })
      })
    }
  })
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  </ErrorBoundary>
)

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RouteTransition><Suspense fallback={<RouteFallback />}><App /></Suspense></RouteTransition>} />
        <Route path="/dashboard" element={<RouteTransition><Suspense fallback={<RouteFallback />}><DashboardPage /></Suspense></RouteTransition>} />
        <Route path="/case-studies/:slug" element={<RouteTransition><Suspense fallback={<RouteFallback />}><CaseStudyPage /></Suspense></RouteTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function RouteTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
    >
      {children}
    </motion.div>
  )
}

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="rounded-2xl border border-gray-200 bg-gray-50/80 px-6 py-4 text-sm font-medium dark:border-gray-800 dark:bg-gray-900/50">
        Loading route...
      </div>
    </div>
  )
}
