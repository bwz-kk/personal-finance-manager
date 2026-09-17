import { formatMinorUnits } from '@pfm/shared'
import { animate, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  valueMinor: number
  currency?: string
}

/**
 * Counts smoothly from the previous minor-units value to the new one on
 * change (e.g. switching the dashboard's month). Never animates on first
 * mount — the initial value renders immediately, so a stat never flashes a
 * misleading intermediate amount on page load. Respects
 * prefers-reduced-motion by jumping straight to the target.
 */
export function AnimatedNumber({ valueMinor, currency = 'BRL' }: AnimatedNumberProps) {
  const [displayMinor, setDisplayMinor] = useState(valueMinor)
  const displayRef = useRef(valueMinor)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) {
      displayRef.current = valueMinor
      setDisplayMinor(valueMinor)
      return
    }
    const controls = animate(displayRef.current, valueMinor, {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => {
        displayRef.current = v
        setDisplayMinor(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [valueMinor, reduceMotion])

  return <span>{formatMinorUnits(displayMinor, currency)}</span>
}
