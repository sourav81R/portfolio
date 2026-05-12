import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import useCoarsePointer from '../../hooks/useCoarsePointer'

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
  rotation: number
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
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const reduceMotion = useReducedMotion()
  const isCoarsePointer = useCoarsePointer()

  useEffect(() => {
    if (reduceMotion || isCoarsePointer) return
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
      if (event.pointerType !== 'mouse') return
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
    }

    const onPointerLeave = () => {
      pointerRef.current.hasLast = false
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      burstsRef.current.push({
        x: event.clientX,
        y: event.clientY,
        age: 0,
        maxAge: 620,
        spokes: 9,
        rotation: Math.random() * Math.PI,
      })
    }

    const draw = (now: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = now
      const delta = Math.min(34, now - lastTimeRef.current)
      lastTimeRef.current = now

      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const darkMode = document.documentElement.classList.contains('dark')
      const trailColor = darkMode ? [110, 231, 183] : [16, 185, 129]
      const webColor = darkMode ? [125, 211, 252] : [37, 99, 235]

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
        const radius = 24 + progress * 122
        const ringSpacing = radius / 5

        context.strokeStyle = `rgba(${webColor[0]}, ${webColor[1]}, ${webColor[2]}, ${alpha})`
        context.lineWidth = 2.2
        context.lineCap = 'round'

        for (let spoke = 0; spoke < burst.spokes; spoke += 1) {
          const angle = burst.rotation + (Math.PI * 2 * spoke) / burst.spokes
          const x = burst.x + Math.cos(angle) * radius
          const y = burst.y + Math.sin(angle) * radius

          context.beginPath()
          context.moveTo(burst.x, burst.y)
          context.lineTo(x, y)
          context.stroke()
        }

        for (let ring = 1; ring <= 5; ring += 1) {
          const ringRadius = ringSpacing * ring
          context.beginPath()
          context.arc(burst.x, burst.y, ringRadius, 0, Math.PI * 2)
          context.stroke()
        }

        nextBursts.push({
          ...burst,
          age: nextAge,
        })
      }
      burstsRef.current = nextBursts.slice(-12)

      rafRef.current = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('pointerdown', onPointerDown, { passive: true })

    rafRef.current = window.requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('pointerdown', onPointerDown)
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
      }
      trailRef.current = []
      burstsRef.current = []
    }
  }, [isCoarsePointer, reduceMotion])

  if (reduceMotion || isCoarsePointer) {
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
