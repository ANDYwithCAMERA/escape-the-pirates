"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Setup() {
  const [playerCount, setPlayerCount] = useState(4)
  const router = useRouter()

  const handleStartGame = () => {
    router.push(`/game?players=${playerCount}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-window rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-space-accent">Mission Setup</h1>
        <div className="mb-4">
          <label htmlFor="playerCount" className="block mb-2 text-space-text">
            Crew Size:
          </label>
          <Input
            type="number"
            id="playerCount"
            min="4"
            value={playerCount}
            onChange={(e) => setPlayerCount(Number.parseInt(e.target.value))}
            className="space-input w-full"
          />
        </div>
        <Button onClick={handleStartGame} className="space-button w-full font-bold py-2 px-4 rounded">
          Generate Crew Terminals
        </Button>
      </div>
    </div>
  )
}

