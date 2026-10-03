import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AppWrapper } from "@/components/app-wrapper"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
})

const siteUrl = "https://ageis-x.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AgeIS-X | Autonomous Digital Defense Platform",
    template: "%s | AgeIS-X",
  },
  description:
    "Autonomous defense operating system protecting websites, communications, devices, identity, and personal data through one unified security platform.",
  keywords: [
    "digital security",
    "cybersecurity",
    "device protection",
    "phishing protection",
    "online scam protection",
    "identity security",
    "privacy defense",
    "threat detection",
    "URL analyzer",
    "zero trust",
    "endpoint security",
  ],
  authors: [{ name: "AgeIS-X Security Systems", url: siteUrl }],
  creator: "AgeIS-X",
  publisher: "AgeIS-X Security Systems",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AgeIS-X",
    title: "AgeIS-X | Autonomous Digital Defense Platform",
    description:
      "Your entire digital life. Protected. Autonomous real-time threat detection, kernel-level behavioral shielding, and identity defense in one unified app.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgeIS-X - Autonomous Digital Defense Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgeIS-X | Autonomous Digital Defense Platform",
    description:
      "Your entire digital life. Protected. Real-time neural threat detection and zero-knowledge privacy defense.",
    images: ["/og-image.png"],
    creator: "@ageisx",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "security",
  classification: "Cybersecurity Software",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#040608" },
    { media: "(prefers-color-scheme: light)", color: "#040608" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark",
}

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AgeIS-X",
  applicationCategory: "SecurityApplication",
  operatingSystem: "macOS, Windows, Linux, Web",
  description:
    "Autonomous digital security platform protecting web browsing, communications, endpoints, identity, and personal data.",
  url: siteUrl,
  author: {
    "@type": "Organization",
    name: "AgeIS-X Security Systems",
    url: siteUrl,
  },
  featureList: [
    "Real-time URL threat vector inference",
    "Zero-knowledge identity vault defense",
    "Endpoint behavioral monitoring",
    "Anti-tracking and canvas noise injection",
    "Unified security posture dashboard",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#040608] text-slate-100 selection:bg-[#00ff66]/20 selection:text-white`}
      >
        <AppWrapper>{children}</AppWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
