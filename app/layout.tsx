import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Escape the Pirates",
  description:
    "A thrilling multiplayer social deduction game set in space. Restart your ship's engine and escape the approaching pirates, but beware of the saboteur among you!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

