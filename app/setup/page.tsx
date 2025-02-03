"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClipboardCopyIcon } from "@radix-ui/react-icons"
import { generateClues, encodePlayerData } from "../utils/clueUtils"
import allClues from "../data/clues.json"

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9)
}

function generateCode() {
  return Math.floor(100 + Math.random() * 900).toString()
}

function corruptCode(code: string) {
  const index = Math.floor(Math.random() * 3)
  const newDigit = Math.floor(Math.random() * 10).toString()
  return code.substring(0, index) + newDigit + code.substring(index + 1)
}

function encodeCorrectCode(code: string) {
  return btoa(code).split("").reverse().join("")
}

export default function Setup() {
  const [playerCount, setPlayerCount] = useState(4)
  const [gameStarted, setGameStarted] = useState(false)
  const [playerUrls, setPlayerUrls] = useState<string[]>([])
  const [gameCode, setGameCode] = useState("")
  const [currentQRIndex, setCurrentQRIndex] = useState(0)
  const router = useRouter()

  const handleStartGame = () => {
    const code = generateCode()
    setGameCode(code)

    const urls = []
    const roles = ["Captain", "Engineer", "Navigator", ...Array(playerCount - 4).fill("Crew Member"), "Pirate"]
    const shuffledRoles = roles.sort(() => Math.random() - 0.5)
    const allPlayerClues = generateClues(playerCount, allClues)

    for (let i = 0; i < playerCount; i++) {
      const role = shuffledRoles[i]
      const playerCode = role === "Pirate" ? "" : Math.random() < 0.3 ? corruptCode(code) : code
      const playerClues = allPlayerClues[i]
      const encodedData = encodePlayerData(role, playerCode, playerClues)
      const url = `${window.location.origin}/player/${generateUniqueId()}?data=${encodedData}`
      urls.push(url)
    }

    setPlayerUrls(urls)
    setGameStarted(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("URL copied to clipboard!")
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  const showNextQR = () => {
    setCurrentQRIndex((prevIndex) => Math.min(prevIndex + 1, playerUrls.length - 1))
  }

  const showPreviousQR = () => {
    setCurrentQRIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  const goToControlSystem = () => {
    router.push(`/control-system?code=${encodeCorrectCode(gameCode)}`)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="space-window rounded-lg p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6 text-center text-space-accent">Crew Assembly</h1>
          <div className="mb-4">
            <label htmlFor="playerCount" className="block mb-2 text-space-text text-xl">
              How many players?
            </label>
            <Input
              type="number"
              id="playerCount"
              min="4"
              value={playerCount}
              onChange={(e) => setPlayerCount(Math.max(4, Number(e.target.value)))}
              className="space-input w-full text-xl"
            />
          </div>
          <Button onClick={handleStartGame} className="space-button w-full font-bold py-3 px-4 rounded text-xl">
            Generate Crew Terminals
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="space-window rounded-lg p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-space-accent">Crew Terminals</h1>
        {playerUrls.length > 0 && (
          <div className="flex flex-col items-center mb-6">
            <span className="font-semibold text-space-accent mb-2 text-2xl">Crew Member {currentQRIndex + 1}</span>
            <QRCodeSVG value={playerUrls[currentQRIndex]} size={Math.min(window.innerWidth * 0.8, 400)} />
            <button
              onClick={() => copyToClipboard(playerUrls[currentQRIndex])}
              className="mt-2 flex items-center space-x-2 text-space-secondary hover:text-space-accent"
            >
              <ClipboardCopyIcon />
              <span>Copy Secret URL</span>
            </button>

        <div className="flex justify-between w-full mt-4 button-container">
            <Button onClick={showPreviousQR} disabled={currentQRIndex === 0} className="space-button">
            Previous Crew Member
            </Button>
            <Button onClick={showNextQR} disabled={currentQRIndex === playerUrls.length - 1} className="space-button">
            Next Crew Member
            </Button>
        </div>


          </div>
        )}
        <p className="mb-4 text-space-secondary text-xl">
          Each crew member should scan the QR code above to get their unique terminal. Alternatively, you can share the URL with them via another means.
        </p>
        <Button onClick={goToControlSystem} className="space-button w-full font-bold py-3 px-4 rounded mb-4 text-xl">
          To the Spaceship Control System!
        </Button>
      </div>
    </div>
  )
}
