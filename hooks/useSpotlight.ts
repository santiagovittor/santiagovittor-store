import { useRef, useCallback } from 'react'

export function useSpotlight() {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    el.style.setProperty('--spotlight-x', x + '%')
    el.style.setProperty('--spotlight-y', y + '%')
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--spotlight-x', '50%')
    el.style.setProperty('--spotlight-y', '50%')
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
