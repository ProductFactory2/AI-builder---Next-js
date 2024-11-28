'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, Home, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"

const GAME_DURATION = 30
const HOLE_COUNT = 9

export default function NotFound() {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [gameActive, setGameActive] = useState(false)
  const [activeMole, setActiveMole] = useState<number | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
        setActiveMole(Math.floor(Math.random() * HOLE_COUNT))
      }, 1000)
    } else if (timeLeft === 0) {
      setGameActive(false)
      setActiveMole(null)
    }
    return () => clearInterval(timer)
  }, [timeLeft, gameActive])

  const startGame = () => {
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setGameActive(true)
    setActiveMole(Math.floor(Math.random() * HOLE_COUNT))
  }

  const whackMole = (index: number) => {
    if (index === activeMole) {
      setScore((prev) => prev + 1)
      setActiveMole(Math.floor(Math.random() * HOLE_COUNT))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black dark flex flex-col items-center justify-center text-orange-500 p-4">
      <motion.h1 
        className="text-6xl font-bold mb-4 text-[#F05D23]"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        404: Bugs Everywhere!
      </motion.h1>
      
      <motion.p 
        className="text-2xl mb-8 text-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        Oops! The page you're looking for is missing.<br />
        But while you're here, let's squash some bugs!
      </motion.p>

      <div className="text-3xl font-mono mb-4">
        Score: {score} | Time: {timeLeft}s
      </div>

      {!gameActive && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            onClick={startGame}
            size="lg"
            className="bg-[#F05D23] hover:bg-[#F05D23] text-black font-bold py-3 px-6 rounded-full shadow-lg"
          >
            Start Whacking Bugs!
          </Button>
        </motion.div>
      )}

      {gameActive && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Array.from({ length: HOLE_COUNT }).map((_, index) => (
            <motion.div
              key={index}
              className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => whackMole(index)}
            >
              <AnimatePresence>
                {activeMole === index && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Bug className="h-16 w-16 text-[#F05D23]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="text-[#F05D23] border-[#F05D23] hover:bg-[#F05D23] hover:text-black"
        >
          <Home className="mr-2 h-4 w-4" />
          Return Home
        </Button>
      </motion.div>

      <motion.p
        className="mt-4 text-sm text-[#F05D23]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Tip: Click on the holes to whack the bugs when they appear!
      </motion.p>

      <motion.div 
        className="absolute top-4 right-4"
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        <RefreshCw className="h-8 w-8 text-[#F05D23] cursor-pointer" onClick={() => window.location.reload()} />
      </motion.div>
    </div>
  )
}

