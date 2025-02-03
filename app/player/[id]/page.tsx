'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { decodePlayerData } from "../../utils/clueUtils"

export default function Player() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const encodedData = searchParams.get("data") || ""

  let role = "", code = "", clues = []

  try {
    const decodedData = decodePlayerData(encodedData)
    role = decodedData.role
    code = decodedData.code
    clues = decodedData.clues
  } catch (error) {
    console.error("Error decoding player data:", error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="space-window rounded-lg p-8 text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-6 text-space-accent">Error</h1>
          <p className="text-space-text text-xl">We couldn't decode your player data. Please make sure the URL is correct or try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-window rounded-lg p-8 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-space-accent">Space Mission Alert: It's Bonkers Time!</h1>
        {role !== "Pirate" ? (
          <>
            <p className="mb-4 text-space-text text-xl">
              You've just awakened from cryo sleep, your mind is fuzzy and you are having trouble remembering anything! The ship's AI is offline, and alarms are blaring.
            </p>
            <p className="mb-4 text-space-text text-xl">
              The last thing you remember is going into cryo sleep for a long voyage. Your should not be awake yet.
            </p>
            <p className="mb-4 text-space-text text-xl">
              The control terminal shows an approaching ship. It is not friendly. You need to use the jump drive to get to safety.

              You need to enter a jump confirmation code to activate the jump drive. Your personal terminal contains the code, but it's been garbled. The crew must cross-reference codes to find the correct one before it's too late.
            </p>
            <p className="mb-4 text-space-text text-xl">
             You don't recognise your own ship. You don't remember your crewmates, or your mission. Slowly though, some details are starting to come back to you.
            </p>
            {clues.map((clue, index) => (
              <p key={index} className="mb-4 text-space-text text-xl">
                {clue.text}
              </p>
            ))}
            <p className="mb-4 text-space-text text-xl">
              Be careful. As you meet with your crew mates, you get an uneasy feeling that not everybody is as they appear.
            </p>
            <p className="mb-4 text-space-secondary text-2xl">
              Your jump confirmation code: <strong className="text-space-accent">{code}</strong>
            </p>
          </>
        ) : (
          <>
            <p className="mb-4 text-space-text text-xl">
              You woke up from cryo hours ago. At least that part of the plan worked. You got a job on this long-range hualer as a cover so you and your merry band of pirates could make off with its cargo.
            </p>
            <p className="mb-4 text-space-text text-xl">
              You planted a virus to pull the ship out of hyperspace at the pre-arranged coordinates, and to wake you. It also erased the jump confirmation codes from the crew's database so that when they finally awoke, they would be stranded here until you made your escapte.
            </p>
            <p className="mb-4 text-space-text text-xl">
              But you underestimated the ship's AI! Before it went offline, it erased your virus before it fully erased the code, and worse, it managed to wake some of the crew.
            </p>
             <p className="mb-4 text-space-text text-xl">
              Keep your cool! The sensors show that your friends are on their way. You just need to delay the crew's efforts to enter the correct jump code until they get here, or even better, trick them into entering an incorrect one.
            </p>
            <p className="mb-4 text-space-text text-xl">
              Your memories have not fully restored, but you are starting to remember some of the things that happened since your joined the ship.
            </p>
            {clues.map((clue, index) => (
              <p key={index} className="mb-4 text-space-text text-xl">
                {clue.text}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
