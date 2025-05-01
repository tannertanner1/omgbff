"use client"

import { useRef, useState } from "react"
import { motion, type HTMLMotionProps } from "motion/react"

function Button({
  children,
  ...props
}: HTMLMotionProps<"button"> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null)
  type Position = {
    x: number
    y: number
  }
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
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="text-primary relative rounded-full px-6 py-2 text-base font-medium"
      {...props}
    >
      {children}
    </motion.button>
  )
}

export { Button }
