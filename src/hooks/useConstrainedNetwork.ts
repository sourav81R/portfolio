import { useEffect, useState } from 'react'

type NetworkInformation = EventTarget & {
  saveData?: boolean
  effectiveType?: string
  downlink?: number
  rtt?: number
}

const getConnection = (): NetworkInformation | undefined => {
  if (typeof navigator === 'undefined') return undefined
  return (navigator as Navigator & { connection?: NetworkInformation }).connection
}

const readConstrainedState = () => {
  const connection = getConnection()
  if (!connection) return false

  return Boolean(
    connection.saveData ||
      /^(slow-2g|2g|3g)$/.test(connection.effectiveType ?? '') ||
      (typeof connection.downlink === 'number' && connection.downlink < 1.5) ||
      (typeof connection.rtt === 'number' && connection.rtt > 800)
  )
}

/**
 * Treat data-saver, slow, and 3G connections as constrained. The browser's
 * native scrolling remains available; this signal only drops optional work.
 */
export default function useConstrainedNetwork() {
  const [isConstrained, setIsConstrained] = useState(readConstrainedState)

  useEffect(() => {
    const connection = getConnection()
    if (!connection) return

    const update = () => setIsConstrained(readConstrainedState())
    connection.addEventListener('change', update)
    return () => connection.removeEventListener('change', update)
  }, [])

  return isConstrained
}
