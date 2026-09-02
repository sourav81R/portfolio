import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import useCoarsePointer from '../../hooks/useCoarsePointer'

type RgbColor = readonly [number, number, number]

/**
 * Web colour cycles one step per click, in the order the palette is written.
 * Light and dark variants are kept in step so the hue is recognisable on
 * either background: the dark values are lightened, since a saturated blue or
 * violet goes nearly invisible against a dark page.
 */
const WEB_COLORS: { light: RgbColor; dark: RgbColor }[] = [
  { light: [220, 38, 38], dark: [248, 113, 113] }, // red
  { light: [234, 88, 12], dark: [251, 146, 60] }, // orange
  { light: [202, 138, 4], dark: [250, 204, 21] }, // yellow
  { light: [22, 163, 74], dark: [74, 222, 128] }, // green
  { light: [37, 99, 235], dark: [96, 165, 250] }, // blue
  { light: [124, 58, 237], dark: [167, 139, 250] }, // violet
  { light: [67, 56, 202], dark: [129, 140, 248] }, // indigo
]

type TrailSegment = {
  x1: number
  y1: number
  x2: number
  y2: number
  life: number
  maxLife: number
}

type SpiderBurst = {
  x: number
  y: number
  age: number
  maxAge: number
  spokes: number
  rings: number
  rotation: number
  baseRadiusX: number
  baseRadiusY: number
  growRadiusX: number
  growRadiusY: number
  warp: number
  strokeWidth: number
  color: RgbColor
}

const CursorSpiderEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailRef = useRef<TrailSegment[]>([])
  const burstsRef = useRef<SpiderBurst[]>([])
  const pointerRef = useRef<{ x: number; y: number; hasLast: boolean }>({
    x: 0,
    y: 0,
    hasLast: false,
  })
  const clickCountRef = useRef(0)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const reduceMotion = useReducedMotion()
  // Touch devices emit no mouse/pen pointer events, so the canvas could only
  // ever stay blank - skip the element and its listeners there entirely.
  const isCoarsePointer = useCoarsePointer()
  const isDisabled = reduceMotion || isCoarsePointer

  useEffect(() => {
    if (isDisabled) return
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      const pointer = pointerRef.current
      const x = event.clientX
      const y = event.clientY

      if (pointer.hasLast) {
        trailRef.current.push({
          x1: pointer.x,
          y1: pointer.y,
          x2: x,
          y2: y,
          life: 380,
          maxLife: 380,
        })
      }

      pointer.x = x
      pointer.y = y
      pointer.hasLast = true
      ensureRunning()
    }

    const onPointerLeave = () => {
      pointerRef.current.hasLast = false
    }

    const onPointerDown = (event: PointerEvent) => {
      // Colour is resolved for the current theme at click time and frozen on
      // the burst, so toggling the theme mid-animation cannot recolour a web
      // that is already on screen.
      const palette = WEB_COLORS[clickCountRef.current % WEB_COLORS.length]
      clickCountRef.current += 1

      burstsRef.current.push({
        color: document.documentElement.classList.contains('dark')
          ? palette.dark
          : palette.light,
        x: event.clientX,
        y: event.clientY,
        age: 0,
        maxAge: 520 + Math.random() * 360,
        spokes: 7 + Math.floor(Math.random() * 5),
        rings: 4 + Math.floor(Math.random() * 4),
        rotation: Math.random() * Math.PI,
        baseRadiusX: 12 + Math.random() * 20,
        baseRadiusY: 12 + Math.random() * 20,
        growRadiusX: 86 + Math.random() * 84,
        growRadiusY: 78 + Math.random() * 92,
        warp: 0.1 + Math.random() * 0.18,
        strokeWidth: 1.8 + Math.random() * 1.4,
      })

      ensureRunning()
    }

    /*
     * The loop is demand-driven: it is only scheduled while there is
     * something to animate, and stops itself once the trail and bursts have
     * drained. Previously it ran at 60fps for the lifetime of the page,
     * clearing an empty canvas and burning CPU/battery even on an idle tab.
     */
    const ensureRunning = () => {
      if (rafRef.current) return
      lastTimeRef.current = 0
      rafRef.current = window.requestAnimationFrame(draw)
    }

    const draw = (now: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = now
      const delta = Math.min(34, now - lastTimeRef.current)
      lastTimeRef.current = now

      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const darkMode = document.documentElement.classList.contains('dark')
      const trailColor = darkMode ? [110, 231, 183] : [16, 185, 129]

      const nextTrail = [] as TrailSegment[]
      for (const segment of trailRef.current) {
        const updatedLife = segment.life - delta
        if (updatedLife <= 0) continue

        const alpha = updatedLife / segment.maxLife
        context.strokeStyle = `rgba(${trailColor[0]}, ${trailColor[1]}, ${trailColor[2]}, ${alpha * 0.8})`
        context.lineWidth = 2.1 + alpha * 1.7
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(segment.x1, segment.y1)
        context.lineTo(segment.x2, segment.y2)
        context.stroke()

        nextTrail.push({
          ...segment,
          life: updatedLife,
        })
      }
      trailRef.current = nextTrail.slice(-140)

      const nextBursts = [] as SpiderBurst[]
      for (const burst of burstsRef.current) {
        const nextAge = burst.age + delta
        const progress = nextAge / burst.maxAge
        if (progress >= 1) continue

        const alpha = 1 - progress
        const radiusX = burst.baseRadiusX + progress * burst.growRadiusX
        const radiusY = burst.baseRadiusY + progress * burst.growRadiusY

        context.strokeStyle = `rgba(${burst.color[0]}, ${burst.color[1]}, ${burst.color[2]}, ${alpha})`
        context.lineWidth = burst.strokeWidth
        context.lineCap = 'round'

        for (let spoke = 0; spoke < burst.spokes; spoke += 1) {
          const baseAngle = burst.rotation + (Math.PI * 2 * spoke) / burst.spokes
          const wobble = Math.sin(progress * 6 + spoke * 1.7) * burst.warp
          const angle = baseAngle + wobble * 0.7
          const x = burst.x + Math.cos(angle) * radiusX
          const y = burst.y + Math.sin(angle) * radiusY

          context.beginPath()
          context.moveTo(burst.x, burst.y)
          context.lineTo(x, y)
          context.stroke()
        }

        for (let ring = 1; ring <= burst.rings; ring += 1) {
          const ringProgress = ring / burst.rings
          context.beginPath()
          for (let spoke = 0; spoke < burst.spokes; spoke += 1) {
            const baseAngle = burst.rotation + (Math.PI * 2 * spoke) / burst.spokes
            const ringWobble =
              Math.sin(ring * 0.9 + spoke * 1.35 + progress * 5.2) * burst.warp
            const angle = baseAngle + ringWobble * 0.65
            const localRadiusX =
              radiusX *
              ringProgress *
              (1 + Math.sin(spoke * 2.1 + ring * 1.3) * burst.warp * 0.35)
            const localRadiusY =
              radiusY *
              ringProgress *
              (1 + Math.cos(spoke * 1.8 + ring * 1.1) * burst.warp * 0.35)
            const x = burst.x + Math.cos(angle) * localRadiusX
            const y = burst.y + Math.sin(angle) * localRadiusY

            if (spoke === 0) context.moveTo(x, y)
            else context.lineTo(x, y)
          }
          context.closePath()
          context.stroke()
        }

        nextBursts.push({
          ...burst,
          age: nextAge,
        })
      }
      burstsRef.current = nextBursts.slice(-12)

      if (trailRef.current.length === 0 && burstsRef.current.length === 0) {
        rafRef.current = 0
        lastTimeRef.current = 0
        return
      }

      rafRef.current = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('pointerdown', onPointerDown, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('pointerdown', onPointerDown)
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
      trailRef.current = []
      burstsRef.current = []
      pointerRef.current.hasLast = false
      lastTimeRef.current = 0
    }
  }, [isDisabled])

  if (isDisabled) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    />
  )
}

export default CursorSpiderEffect
