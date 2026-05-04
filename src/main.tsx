import { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PageTransition } from './components/common/PageTransition'
import ErrorBoundary from './components/system/ErrorBoundary'
import './index.css'

const App = lazy(() => import('./App'))
const DashboardPage = lazy(() => import('./pages/DashboardView'))
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))
const baseUrl = import.meta.env.BASE_URL
const routerBasename = baseUrl === '/' ? undefined : baseUrl.replace(/\/$/, '')

const savedTheme = localStorage.getItem('theme')

if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else if (savedTheme === 'light') {
  document.documentElement.classList.remove('dark')
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.PROD) {
      navigator.serviceWorker.register(`${baseUrl}sw.js`).catch((error) => {
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
    <BrowserRouter basename={routerBasename}>
      <AnimatedRoutes />
    </BrowserRouter>
  </ErrorBoundary>
)

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Suspense fallback={<RouteFallback />}><App /></Suspense></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Suspense fallback={<RouteFallback />}><DashboardPage /></Suspense></PageTransition>} />
        <Route path="/case-studies/:slug" element={<PageTransition><Suspense fallback={<RouteFallback />}><CaseStudyPage /></Suspense></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
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
