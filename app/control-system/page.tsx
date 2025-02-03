"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skull } from "lucide-react"

function decodeCorrectCode(encodedCode: string): string {
  return atob(encodedCode.split("").reverse().join(""))
}

function ControlSystemInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const encodedCode = searchParams.get("code") || ""
  const correctCode = decodeCorrectCode(encodedCode)

  const [inputCode, setInputCode] = useState("   ")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [piratesWin, setPiratesWin] = useState(false)
  const [showPirateShip, setShowPirateShip] = useState(false)
  const [scannerAngle, setScannerAngle] = useState(0)

  const pirateShipRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const totalTime = Math.floor(Math.random() * (30 - 15 + 1) + 15) * 60 // Random time between 15 and 30 minutes in seconds
    setTimeRemaining(totalTime)

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setGameOver(true)
          setPiratesWin(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    const scannerRotation = setInterval(() => {
      setScannerAngle((prevAngle) => (prevAngle + 1) % 360)
    }, 1000 / 60) // 60 FPS

    return () => {
      clearInterval(timer)
      clearInterval(scannerRotation)
    }
  }, [])

  useEffect(() => {
    const progress = 1 - timeRemaining / (30 * 60) // Max time = 30 minutes
    const radarSize = 400 // This value should match the viewBox
    const center = radarSize / 2
    const radius = (center - 20) * (1 - progress) // Adjust radius dynamically
    const angle = progress * 2 * Math.PI
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    pirateShipRef.current = { x, y }
  }, [timeRemaining])

  useEffect(() => {
    const pirateShipAngle = Math.atan2(pirateShipRef.current.y - 200, pirateShipRef.current.x - 200) * (180 / Math.PI)
    const normalizedPirateAngle = (pirateShipAngle + 360) % 360
    const angleDifference = Math.abs(scannerAngle - normalizedPirateAngle)

    if (angleDifference < 5 || angleDifference > 355) {
      setShowPirateShip(true)
      setTimeout(() => setShowPirateShip(false), 2000) // Hide after 2 seconds for fade-out effect
    }
  }, [scannerAngle])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputCode.replace(/\s/g, "") === correctCode) {
      setGameOver(true)
      setPiratesWin(false)
    } else {
      setGameOver(true)
      setPiratesWin(true)
    }
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="space-window rounded-lg p-8 text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-6 text-space-accent">{piratesWin ? "Pirates Win!" : "Crew Escapes!"}</h1>
          <p className="mb-6 text-space-text">
            {piratesWin
              ? inputCode
                ? "Incorrect code entered. The pirates have seized control of your ship!"
                : "The pirates have boarded your ship before you could initiate a jump!"
              : "Congratulations! You've successfully jumped the ship to safety and escaped the pirates!"}
          </p>
          <Button onClick={() => router.push("/")} className="space-button font-bold py-2 px-4 rounded">
            Play Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-window rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-space-accent">Spaceship Control System</h1>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-space-text">Scanner</h2>
          <div className="relative w-full max-w-[400px] h-auto aspect-square mx-auto">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="180" fill="none" stroke="#0f0" strokeWidth="2" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="#0f0" strokeWidth="2" />
              <circle cx="200" cy="200" r="60" fill="none" stroke="#0f0" strokeWidth="2" />
              <line
                x1="200"
                y1="200"
                x2="380"
                y2="200"
                stroke="#0f0"
                strokeWidth="2"
                style={{ transform: `rotate(${scannerAngle}deg)`, transformOrigin: "200px 200px" }}
              />
              <circle cx="200" cy="200" r="5" fill="#0f0" />
              {showPirateShip && (
                <g>
                  <circle cx={pirateShipRef.current.x} cy={pirateShipRef.current.y} r="5" fill="red" />
                  <Skull x={pirateShipRef.current.x + 10} y={pirateShipRef.current.y - 10} size={20} color="red" />
                </g>
              )}
            </svg>
          </div>
        </div>
        <p className="text-2xl font-bold text-space-text">Enter Jump Confirmation Code</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between space-x-4">
            {[0, 1, 2].map((i) => (
              <Input
                key={i}
                type="number"
                value={inputCode[i] || ""}
                onChange={(e) => {
                  let newCode = inputCode.split("")
                  newCode[i] = e.target.value
                  setInputCode(newCode.join(""))
                }}
                className="space-input w-1/3 text-center text-2xl"
                min={0}
                max={9}
                required
              />
            ))}
          </div>
          <Button type="submit" className="space-button w-full font-bold py-2 px-4 rounded">
            Initiate Jump
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function ControlSystem() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ControlSystemInner />
    </Suspense>
  )
}
