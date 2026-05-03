import { useEffect, useState } from 'react'

const coarsePointerQuery = '(hover: none), (pointer: coarse)'

const getInitialCoarsePointer = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  return window.matchMedia(coarsePointerQuery).matches
}

const useCoarsePointer = () => {
  const [isCoarsePointer, setIsCoarsePointer] = useState(getInitialCoarsePointer)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const media = window.matchMedia(coarsePointerQuery)
    const handleChange = () => setIsCoarsePointer(media.matches)

    handleChange()
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [])

  return isCoarsePointer
}

export default useCoarsePointer
