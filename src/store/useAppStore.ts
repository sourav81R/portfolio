import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProjectRecord } from '../data/projects'

type Accent = 'cyan' | 'emerald' | 'violet' | 'amber'

export type AnalyticsEventKind = 'page-view' | 'click' | 'project'

export type AnalyticsEvent = {
  id: string
  kind: AnalyticsEventKind
  key: string
  timestamp: number
}

type AnalyticsState = {
  viewsByRoute: Record<string, number>
  clicksByTarget: Record<string, number>
  projectInteractions: Record<string, number>
  events: AnalyticsEvent[]
}

type AppState = {
  recruiterMode: boolean
  themePanelOpen: boolean
  accent: Accent
  projectOrder: string[]
  analytics: AnalyticsState
  toggleRecruiterMode: () => void
  setThemePanelOpen: (open: boolean) => void
  setAccent: (accent: Accent) => void
  recordPageView: (route: string) => void
  recordClick: (target: string) => void
  recordProjectInteraction: (slug: string) => void
  resetAnalytics: () => void
  initializeProjectOrder: (projects: ProjectRecord[]) => void
  reorderProjects: (fromSlug: string, toSlug: string) => void
}

const MAX_ANALYTICS_EVENTS = 400

const increment = (record: Record<string, number>, key: string) => ({
  ...record,
  [key]: (record[key] ?? 0) + 1,
})

const appendEvent = (
  events: AnalyticsEvent[],
  kind: AnalyticsEventKind,
  key: string
) => {
  const nextEvent: AnalyticsEvent = {
    id: `${kind}:${key}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    kind,
    key,
    timestamp: Date.now(),
  }

  return [...events, nextEvent].slice(-MAX_ANALYTICS_EVENTS)
}

const createEmptyAnalyticsState = (): AnalyticsState => ({
  viewsByRoute: {},
  clicksByTarget: {},
  projectInteractions: {},
  events: [],
})

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      recruiterMode: false,
      themePanelOpen: false,
      accent: 'cyan',
      projectOrder: [],
      analytics: createEmptyAnalyticsState(),
      toggleRecruiterMode: () =>
        set((state) => ({ recruiterMode: !state.recruiterMode })),
      setThemePanelOpen: (open) => set({ themePanelOpen: open }),
      setAccent: (accent) => set({ accent }),
      recordPageView: (route) =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            viewsByRoute: increment(state.analytics.viewsByRoute, route),
            events: appendEvent(state.analytics.events ?? [], 'page-view', route),
          },
        })),
      recordClick: (target) =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            clicksByTarget: increment(state.analytics.clicksByTarget, target),
            events: appendEvent(state.analytics.events ?? [], 'click', target),
          },
        })),
      recordProjectInteraction: (slug) =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            projectInteractions: increment(state.analytics.projectInteractions, slug),
            events: appendEvent(state.analytics.events ?? [], 'project', slug),
          },
        })),
      resetAnalytics: () =>
        set({
          analytics: createEmptyAnalyticsState(),
        }),
      initializeProjectOrder: (projects) => {
        const currentOrder = get().projectOrder
        const nextSlugs = projects.map((project) => project.slug)

        if (currentOrder.length === 0) {
          set({ projectOrder: nextSlugs })
          return
        }

        const knownSlugs = new Set(currentOrder)
        const missingSlugs = nextSlugs.filter((slug) => !knownSlugs.has(slug))

        if (missingSlugs.length > 0) {
          set({ projectOrder: [...currentOrder, ...missingSlugs] })
        }
      },
      reorderProjects: (fromSlug, toSlug) =>
        set((state) => {
          const order = [...state.projectOrder]
          const fromIndex = order.indexOf(fromSlug)
          const toIndex = order.indexOf(toSlug)
          if (fromIndex === -1 || toIndex === -1) return state
          const [moved] = order.splice(fromIndex, 1)
          order.splice(toIndex, 0, moved)
          return { projectOrder: order }
        }),
    }),
    {
      name: 'portfolio-app-store',
      version: 2,
      migrate: (persistedState: unknown) => {
        const state = persistedState as Partial<AppState> | undefined

        return {
          ...state,
          analytics: {
            ...createEmptyAnalyticsState(),
            ...state?.analytics,
            events: state?.analytics?.events ?? [],
          },
        } satisfies Partial<AppState>
      },
    }
  )
)
