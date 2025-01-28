"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function decodeCorrectCode(encodedCode: string) {
  return atob(encodedCode.split("").reverse().join(""))
}

function ResultContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success") === "true"
  const encodedCorrectCode = searchParams.get("code") || ""
  const correctCode = decodeCorrectCode(encodedCorrectCode)

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-window rounded-lg p-8 text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-space-accent">
          {success ? "Mission Successful!" : "Mission Failed!"}
        </h1>
        <p className="mb-6 text-space-text">
          {success
            ? "The engine has restarted! The crew has saved the ship!"
            : `The engine remains offline. The pirate has succeeded in their sabotage! The correct code was: ${correctCode}`}
        </p>
        <Link href="/">
          <Button className="space-button font-bold py-2 px-4 rounded">Begin New Mission</Button>
        </Link>
      </div>
    </div>
  )
}

export default function ResultClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  )
}

