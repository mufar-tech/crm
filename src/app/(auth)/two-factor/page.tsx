"use client"

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react"
import Link from "next/link"
import { Shield, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function TwoFactorPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [useRecovery, setUseRecovery] = useState(false)
  const [recoveryCode, setRecoveryCode] = useState("")
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value
    setDigits(newDigits)
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newDigits = [...digits]
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    setDigits(newDigits)
    const nextIndex = Math.min(pasted.length, 5)
    inputsRef.current[nextIndex]?.focus()
  }

  const handleVerify = async () => {
    setError("")
    if (!useRecovery) {
      if (digits.some((d) => !d)) {
        setError("Please enter all 6 digits")
        return
      }
    } else {
      if (!recoveryCode) {
        setError("Please enter your recovery code")
        return
      }
    }
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setIsLoading(false)
  }

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
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
        <CardTitle className="text-xl mb-2">Two-factor authentication</CardTitle>
        <CardDescription className="text-base mb-6">
          {useRecovery
            ? "Enter your recovery code"
            : "Enter the 6-digit code from your authenticator app"}
        </CardDescription>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!useRecovery ? (
          <div className="flex justify-center gap-2 mb-6">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-11 h-12 text-center text-lg font-semibold rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>
        ) : (
          <div className="mb-6">
            <Input
              placeholder="Enter your recovery code"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              className="text-center"
            />
          </div>
        )}
        <Button
          className="w-full h-11 text-base mb-4"
          onClick={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
        <button
          type="button"
          onClick={() => { setUseRecovery(!useRecovery); setError("") }}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 mb-6"
        >
          {useRecovery ? "Use authenticator code" : "Use recovery code"}
        </button>
        <p className="text-sm text-gray-500">
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
