import { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PageTransition } from './components/common/PageTransition'
import ErrorBoundary from './components/system/ErrorBoundary'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import './index.css'

const App = lazy(() => import('./App'))
const DashboardPage = lazy(() => import('./pages/DashboardView'))
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))
const baseUrl = import.meta.env.BASE_URL
const routerBasename = baseUrl === '/' ? undefined : baseUrl.replace(/\/$/, '')

const savedTheme = localStorage.getItem('theme')

if (savedTheme !== 'light') {
  document.documentElement.classList.add('dark')
} else {
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

/*
 * Drop the crawler-visible fallback in index.html once the real app is about
 * to render. Leaving it would put a second <h1> in the document and duplicate
 * the hero copy for anyone running JavaScript.
 */
document.getElementById('seo-fallback')?.remove()

ReactDOM.createRoot(rootElement).render(
  <ErrorBoundary>
    <BrowserRouter basename={routerBasename}>
      <SmoothScrollProvider>
        <AnimatedRoutes />
      </SmoothScrollProvider>
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

/*
 * Deliberately blank.
 *
 * Every route is lazy, so this renders in the gap between React mounting and
 * the route chunk arriving - on the homepage that is the first thing a
 * visitor from a search result saw, a "Loading route..." card that then
 * vanished. A labelled placeholder only reads as a glitch at this duration,
 * and the page background is already painted underneath it.
 *
 * It keeps min-h-screen so the footer cannot flash up the page while the
 * chunk is in flight, and stays transparent so the real background shows
 * through in either theme.
 */
function RouteFallback() {
  return <div className="min-h-screen" aria-hidden="true" />
}
