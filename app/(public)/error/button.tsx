'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'

type Position = {
  x: number
  y: number
}

export function Button() {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ref.current) {
      const { clientX, clientY } = e
      const { height, width, left, top } = ref.current.getBoundingClientRect()
      const middleX = clientX - (left + width / 2)
      const middleY = clientY - (top + height / 2)
      setPosition({ x: middleX, y: middleY })
    }
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const { x, y } = position
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className='relative rounded-xl px-6 py-2 text-base font-medium text-primary'
    >
      Try again
    </motion.button>
  )
}

/** @see https://syntaxui.com/components/button/magnetic-button */
