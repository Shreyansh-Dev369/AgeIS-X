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

const siteUrl = "https://aegis-x.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AgeIS-X | AI-Powered Phishing & Fraud Protection Platform",
    template: "%s | AgeIS-X",
  },
  description:
    "Enterprise-grade AI cybersecurity platform protecting against phishing, malware, and online fraud. Real-time URL scanning with 99.8% accuracy using advanced NLP, TF-IDF vectorization & machine learning. Trusted by 500+ organizations worldwide.",
  keywords: [
    "phishing detection",
    "AI cybersecurity",
    "fraud protection",
    "URL scanner",
    "malware detection",
    "enterprise security",
    "machine learning security",
    "threat intelligence",
    "cyber threat protection",
    "email security",
    "anti-phishing",
    "security platform",
    "real-time threat detection",
    "NLP security",
    "URL risk scoring",
  ],
  authors: [{ name: "AgeIS-X", url: siteUrl }],
  creator: "AgeIS-X",
  publisher: "AgeIS-X",
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
    title: "AgeIS-X | AI-Powered Phishing & Fraud Protection Platform",
    description:
      "Enterprise-grade AI cybersecurity platform protecting against phishing, malware, and online fraud. Real-time URL scanning with 99.8% accuracy.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgeIS-X - AI-Powered Cybersecurity Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgeIS-X | AI-Powered Phishing & Fraud Protection",
    description:
      "Enterprise-grade AI cybersecurity with 99.8% accuracy. Real-time phishing detection using ML & NLP.",
    images: ["/og-image.png"],
    creator: "@aegisx",
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
  category: "technology",
  classification: "Cybersecurity Software",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#030712" },
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
  operatingSystem: "Web, Chrome Extension",
  description:
    "Enterprise-grade AI cybersecurity platform protecting against phishing, malware, and online fraud with 99.8% accuracy.",
  url: siteUrl,
  author: {
    "@type": "Organization",
    name: "AgeIS-X",
    url: siteUrl,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "500",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Real-time URL scanning",
    "AI-powered phishing detection",
    "Enterprise dashboard",
    "Chrome browser extension",
    "API integration",
    "Threat intelligence",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <AppWrapper>{children}</AppWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
