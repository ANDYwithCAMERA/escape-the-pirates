import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-window rounded-lg p-8 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-space-accent">Escape The Pirates</h1>
        <p className="mb-4 text-space-text">A multiplayer social deduction game set in the depths of space.</p>
        <p className="mb-6 text-space-secondary">
          Your crew has just awakened from cryo sleep, their memories fragmented and confused. The ship's engine is
          offline, and an unknown vessel is approaching rapidly. Work together to restart the engine, but beware - a
          saboteur may be among you, taking advantage of your crew's memory loss!
        </p>
        <Link href="/setup">
          <Button className="space-button font-bold py-2 px-4 rounded">Start New Mission</Button>
        </Link>
      </div>
    </div>
  )
}
