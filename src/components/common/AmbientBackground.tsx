import { motion, useReducedMotion } from 'framer-motion'
import useCoarsePointer from '../../hooks/useCoarsePointer'

type FloatingShape = {
  id: string
  size: number
  left: string
  top: string
  duration: number
  delay: number
  color: string
  type: 'circle' | 'square' | 'diamond' | 'triangle'
}

const floatingShapes: FloatingShape[] = [
  { id: 's1', size: 72, left: '14%', top: '18%', duration: 18, delay: 0, color: 'rgba(59,130,246,0.14)', type: 'circle' },
  { id: 's2', size: 94, left: '28%', top: '64%', duration: 24, delay: 1.5, color: 'rgba(239,68,68,0.1)', type: 'diamond' },
  { id: 's3', size: 64, left: '43%', top: '26%', duration: 20, delay: 0.8, color: 'rgba(56,189,248,0.12)', type: 'square' },
  { id: 's4', size: 108, left: '61%', top: '72%', duration: 26, delay: 2.2, color: 'rgba(220,38,38,0.1)', type: 'triangle' },
  { id: 's5', size: 80, left: '74%', top: '34%', duration: 22, delay: 0.6, color: 'rgba(37,99,235,0.14)', type: 'diamond' },
  { id: 's6', size: 58, left: '84%', top: '78%', duration: 19, delay: 1.1, color: 'rgba(248,113,113,0.09)', type: 'circle' },
  { id: 's7', size: 66, left: '52%', top: '10%', duration: 21, delay: 0.4, color: 'rgba(99,102,241,0.1)', type: 'square' },
]

const shapeClass: Record<FloatingShape['type'], string> = {
  circle: 'rounded-full',
  square: 'rounded-xl',
  diamond: 'rounded-lg rotate-45',
  triangle: 'triangle-shape',
}

const AmbientBackground = () => {
  const reduceMotion = useReducedMotion()
  /*
   * Phones pay the most for this layer and see it the least. The three large
   * blurred orbs are cheap enough to keep (they are static-positioned and the
   * blur is rasterised once), but the seven shapes each carry their own
   * backdrop-filter and an independent infinite transform, which is what
   * actually costs frames on a mobile GPU - so they are dropped there.
   */
  const isCoarsePointer = useCoarsePointer()
  const staticShapes = reduceMotion || isCoarsePointer

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -top-28 left-[-8%] h-[420px] w-[420px] rounded-full bg-blue-500/18 blur-[120px]"
        animate={reduceMotion ? undefined : { x: [0, 26, -8, 0], y: [0, -12, 8, 0], opacity: [0.45, 0.62, 0.45] }}
        transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-6%] top-[18%] h-[520px] w-[520px] rounded-full bg-blue-400/14 blur-[150px]"
        animate={reduceMotion ? undefined : { x: [0, -20, 10, 0], y: [0, 16, -8, 0], opacity: [0.4, 0.58, 0.4] }}
        transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-12%] left-[32%] h-[420px] w-[420px] rounded-full bg-red-500/12 blur-[130px]"
        animate={reduceMotion ? undefined : { x: [0, -18, 12, 0], y: [0, -10, 6, 0], opacity: [0.34, 0.5, 0.34] }}
        transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0">
        {(isCoarsePointer ? [] : floatingShapes).map((shape) => (
          <motion.div
            key={shape.id}
            className={`absolute ${shapeClass[shape.type]} border border-white/10 backdrop-blur-[1px]`}
            style={{
              width: shape.size,
              height: shape.type === 'triangle' ? shape.size * 0.84 : shape.size,
              left: shape.left,
              top: shape.top,
              backgroundColor: shape.color,
            }}
            animate={
              staticShapes
                ? undefined
                : {
                    y: [0, -16, 9, 0],
                    x: [0, 8, -10, 0],
                    rotate: shape.type === 'diamond' ? [45, 53, 39, 45] : [0, 8, -6, 0],
                    opacity: [0.22, 0.36, 0.24, 0.22],
                  }
            }
            transition={
              staticShapes
                ? undefined
                : {
                    duration: shape.duration,
                    delay: shape.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          />
        ))}
      </div>

    </div>
  )
}

export default AmbientBackground
