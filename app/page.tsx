import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-window rounded-lg p-8 text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 text-space-accent">Escape the Space Pirates!</h1>
        <p className="mb-4 text-space-text text-xl">
          A social deduction game set in the depths of space.
        </p>
        <p className="mb-6 text-space-secondary text-lg">
          Your crew has just awakened from cryo sleep, their memories scrambled! The ship's AI is
          offline, and an unfriendly looking ship is approaching. Can you jump to safety before it arrives?
        </p>
        <p className="mb-6 text-space-secondary text-lg">
          Four or more can play. Each player gets a URL to open on their phone with a unique set of memories.
        </p>
        <p className="mb-6 text-space-secondary text-lg">
          Each player needs their own device to play. This device will be used to monitor the scanner and enter the jump confirmation code.
        </p>
        <Link href="/setup">
          <Button className="space-button font-bold py-3 px-6 text-xl">Start New Game</Button>
        </Link>
      </div>
    </div>
  )
}
