import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Escape the Pirates',
  description: 'A social deduction game set in space.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
