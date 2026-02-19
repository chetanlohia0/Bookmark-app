import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Bookmark",
  description: "Your private, AI-powered bookmark manager",
  icons: {
    icon: "/screenshots/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#faf7f2' }}>{children}</body>
    </html>
  )
}