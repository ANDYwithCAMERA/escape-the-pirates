"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { ClipboardCopyIcon } from "@radix-ui/react-icons"
import { generateClues, encodePlayerData } from "../utils/clueUtils"

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9)
}

function generateCode() {
  return Math.floor(100 + Math.random() * 900).toString()
}

function corruptCode(code: string, i: Number) {
  const index = ((i - 1) % 3) + 1
  const newDigit = Math.floor(Math.random() * 10)
  return code.substring(0, index) + newDigit + code.substring(index + 1)
}

function encodeCorrectCode(code: string) {
  return btoa(code).split("").reverse().join("")
}

function GameContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const playerCount = Number.parseInt(searchParams.get("players") || "4")
  const [playerUrls, setPlayerUrls] = useState<string[]>([])
  const [hostUrl, setHostUrl] = useState("")
  const [gameCode, setGameCode] = useState("")
  const [currentQRIndex, setCurrentQRIndex] = useState(0)
  const [isClient, setIsClient] = useState(false) // New state to detect client-side rendering

  useEffect(() => {
    // Set isClient to true once the component has mounted (client-side)
    setIsClient(true)
  }, [])

  useEffect(() => {
    const code = generateCode()
    setGameCode(code)

    const urls = []
    const roles = ["Captain", "Engineer", "Navigator", ...Array(playerCount - 4).fill("Crew Member"), "Pirate"]
    const shuffledRoles = roles.sort(() => Math.random() - 0.5)

    // Generate URL for host (first player)
    const hostRole = shuffledRoles[0]
    const hostCode = hostRole === "Pirate" ? code : corruptCode(code, 0)
    const hostClues = generateClues(hostRole === "Pirate")
    const hostEncodedData = encodePlayerData(hostRole, hostCode, hostClues)
    const hostUniqueId = generateUniqueId()
    setHostUrl(`${window.location.origin}/player/${hostUniqueId}?data=${hostEncodedData}`)

    // Generate URLs for other players
    for (let i = 1; i < playerCount; i++) {
      const role = shuffledRoles[i]
      const playerCode = role === "Pirate" ? code : corruptCode(code, i)
      const playerClues = generateClues(role === "Pirate")
      const encodedData = encodePlayerData(role, playerCode, playerClues)
      const url = `${window.location.origin}/player/${generateUniqueId()}?data=${encodedData}`
      urls.push(url)
    }

    setPlayerUrls(urls)
  }, [playerCount])

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

  const goToHostCharacter = () => {
    router.push(`${hostUrl}&hostCode=${encodeCorrectCode(gameCode)}`)
  }

  const showNextQR = () => {
    setCurrentQRIndex((prevIndex) => Math.min(prevIndex + 1, playerUrls.length - 1))
  }

  const showPreviousQR = () => {
    setCurrentQRIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  if (!isClient) {
    return null; // Don't render the component until we're on the client
  }

  return (
    <div className="min-h-screen p-8">
      <div className="space-window rounded-lg p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-space-accent">Crew Terminals</h1>
        {playerUrls.length > 0 && (
          <div className="flex flex-col items-center mb-6">
            <span className="font-semibold text-space-accent mb-2">Crew Member {currentQRIndex + 2}</span>
            <QRCodeSVG value={playerUrls[currentQRIndex]} size={Math.min(window.innerWidth * 0.8, 400)} />
            <button
              onClick={() => copyToClipboard(playerUrls[currentQRIndex])}
              className="mt-2 flex items-center space-x-2 text-space-secondary hover:text-space-accent"
            >
              <ClipboardCopyIcon />
              <span>Copy URL</span>
            </button>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={showPreviousQR} disabled={currentQRIndex === 0} className="space-button">
                Previous
              </Button>
              <Button onClick={showNextQR} disabled={currentQRIndex === playerUrls.length - 1} className="space-button">
                Next
              </Button>
            </div>
          </div>
        )}
        <p className="mb-4 text-space-secondary">
          Transmit these secure QR codes to each crew member. Each code is encrypted and should only be accessed by its
          designated crew member.
        </p>
        <Button onClick={goToHostCharacter} className="space-button w-full font-bold py-2 px-4 rounded mb-4">
          View Your Character (Host)
        </Button>
      </div>
    </div>
  )
}

export default function GameClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent />
    </Suspense>
  )
}
