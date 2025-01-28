"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function decodeCorrectCode(encodedCode: string) {
  return atob(encodedCode.split("").reverse().join(""))
}

function HostContent() {
  const [enteredCode, setEnteredCode] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const encodedCorrectCode = searchParams.get("code") || ""
  const correctCode = decodeCorrectCode(encodedCorrectCode)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isCorrect = enteredCode === correctCode
    router.push(`/result?success=${isCorrect}&code=${encodedCorrectCode}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-window rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-space-accent">Engine Restart Terminal</h1>
        <p className="mb-4 text-space-text">The crew has convened and reached a consensus on the restart code.</p>
        <p className="mb-4 text-space-secondary">
          Caution: An incorrect code will leave the ship defenseless against the approaching vessel.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            placeholder="Enter 3-digit restart code"
            pattern="\d{3}"
            required
            className="space-input w-full"
          />
          <Button type="submit" className="space-button w-full font-bold py-2 px-4 rounded">
            Initiate Restart Sequence
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function HostClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HostContent />
    </Suspense>
  )
}

