"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Mail, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false)
  const [error, setError] = useState("")
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return
    setError("")
    setResending(true)
    await new Promise((r) => setTimeout(r, 2000))
    setResending(false)
    setCooldown(60)
  }, [cooldown])

  return (
    <Card className="border-0 shadow-xl sm:border sm:border-gray-200">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Mufar Technologies</div>
            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mufar CRM
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl mb-2">Verify your email</CardTitle>
        <CardDescription className="text-base mb-1">
          We sent a verification link to
        </CardDescription>
        <p className="text-sm font-medium text-gray-900 mb-6">john@example.com</p>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full h-11 mb-6"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
        >
          {resending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resending...
            </>
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : (
            "Resend verification"
          )}
        </Button>
        <p className="text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
