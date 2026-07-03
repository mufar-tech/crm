import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Mufar CRM - Enterprise Customer Relationship Management",
  description: "Modern CRM platform by Mufar Technologies. Manage leads, customers, sales pipelines, and business growth.",
  keywords: ["CRM", "Customer Relationship Management", "Mufar Technologies", "Sales", "Enterprise"],
  icons: {
    icon: "/mufar_crm_favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f8fafc] text-[#111827] font-sans">
        {children}
      </body>
    </html>
  )
}
