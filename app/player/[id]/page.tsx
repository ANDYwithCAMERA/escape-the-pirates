"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function decodeData(encodedData: string) {
  return JSON.parse(atob(encodedData))
}

export default function Player() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const encodedData = searchParams.get("data") || ""
  const { role, code } = decodeData(encodedData)

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-window rounded-lg p-8 text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-space-accent">Space Mission Alert</h1>
        {role !== "Pirate" ? (
          <>
            <p className="mb-4 text-space-text">
              You've just awakened from cryo sleep, your mind still foggy and memories fragmented. The familiar
              surroundings of the ship seem alien as your consciousness struggles to piece together your identity and
              purpose.
            </p>
            <p className="mb-4 text-space-text">
              As the haze slowly lifts, urgent alarms pierce through your confusion. The ship's engine is offline, and
              an unknown vessel is rapidly approaching. Despite your fractured memories, a sense of duty compels you to
              action.
            </p>
            <p className="mb-4 text-space-secondary">
              Your role: <strong className="text-space-accent">{role}</strong>
            </p>
            <p className="mb-4 text-space-secondary">
              Your restart code: <strong className="text-space-accent">{code}</strong>
            </p>
            <p className="mb-4 text-space-text">
              Warning: Possible data corruption detected. Cross-reference your code with other crew members to determine
              the correct restart sequence.
            </p>
          </>
        ) : (
          <>
            <p className="mb-4 text-red-400">
              You've successfully infiltrated this ship and signaled your pirate allies. The crew has unexpectedly
              awakened from cryo sleep!
            </p>
            <p className="mb-4 text-red-400">
              Mission: Impersonate a crew member and provide false codes to prevent engine restart before your allies
              arrive. Be cautious, as the crew's memories are still hazy from cryo sleep.
            </p>
          </>
        )}
        {searchParams.get("hostCode") && (
          <Link href={`/host?code=${searchParams.get("hostCode")}`}>
            <Button className="space-button font-bold py-2 px-4 rounded mt-4">Enter Restart Code</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

