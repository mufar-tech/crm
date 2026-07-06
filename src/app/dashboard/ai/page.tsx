"use client"

import { useState } from "react"
import {
  Brain,
  MessageSquare,
  LineChart,
  Lightbulb,
  Heart,
  Sparkles,
  ArrowRight,
  Zap,
  Clock,
  BarChart3,
  Target,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { cn } from "@/lib/utils"

const aiCapabilities = [
  {
    icon: Target,
    title: "Lead Scoring",
    description: "AI-powered lead scoring based on behavior and demographics to prioritize your best prospects.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: BarChart3,
    title: "Opportunity Prediction",
    description: "Predict deal outcomes with ML models trained on thousands of successful and lost opportunities.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: MessageSquare,
    title: "Follow-up Suggestions",
    description: "Smart follow-up recommendations with optimal timing and personalized message templates.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    icon: LineChart,
    title: "Revenue Forecasting",
    description: "AI-driven revenue predictions with scenario analysis and confidence scoring for accurate planning.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "Automated business insights that surface trends, anomalies, and growth opportunities in your data.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Heart,
    title: "Sentiment Analysis",
    description: "Customer communication sentiment analysis to gauge satisfaction and identify at-risk relationships.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    gradient: "from-rose-500 to-rose-600",
  },
]

export default function AIPage() {
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [waitlistJoined, setWaitlistJoined] = useState(false)

  function handleJoinWaitlist() {
    setWaitlistLoading(true)
    setTimeout(() => {
      setWaitlistLoading(false)
      setWaitlistJoined(true)
      setTimeout(() => setWaitlistJoined(false), 4000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mufar AI Assistant</h1>
            <Badge variant="premium" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 gap-1.5">
              <Sparkles className="h-3 w-3" />
              Coming Soon
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Intelligent automation and AI-powered insights for your CRM</p>
        </div>
        <Button
          variant="premium"
          size="xl"
          className="gap-2"
          onClick={handleJoinWaitlist}
          disabled={waitlistLoading}
        >
          {waitlistLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Join Waitlist
        </Button>
      </div>

      {waitlistJoined && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg">
          <CheckCircle2 className="h-4 w-4" />
          You&apos;re on the list! We&apos;ll notify you when Mufar AI Assistant launches.
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-transparent rounded-2xl" />
        <Card className="relative border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Supercharge Your Sales with AI</h2>
                <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                  Mufar AI Assistant leverages cutting-edge machine learning to automate lead scoring, 
                  predict deal outcomes, and provide actionable insights. Transform your CRM data into 
                  a competitive advantage.
                </p>
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Predictive Analytics
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Brain className="h-4 w-4 text-purple-500" />
                    ML-Powered
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Real-time Insights
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {aiCapabilities.map((capability) => (
          <Card key={capability.title} className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              "bg-gradient-to-br", capability.gradient, "opacity-5"
            )} />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", capability.bg)}>
                  <capability.icon className={cn("h-5 w-5", capability.color)} />
                </div>
                <Badge variant="secondary" className="bg-gray-50 text-gray-500 border-gray-200 text-[10px] animate-pulse">
                  <Sparkles className="h-3 w-3 mr-0.5 text-amber-500" />
                  Coming Soon
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold text-gray-900 mt-3">{capability.title}</CardTitle>
              <CardDescription className="text-xs text-gray-500 leading-relaxed">{capability.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more
                <ArrowRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="text-white">
              <h3 className="text-lg font-semibold">Ready to Transform Your Sales Process?</h3>
              <p className="text-sm text-blue-100 mt-1 max-w-xl">
                Join the waitlist to be the first to experience Mufar AI Assistant. Early adopters get 
                exclusive access and priority onboarding.
              </p>
            </div>
            <Button
              variant="secondary"
              size="xl"
              className="bg-white/20 text-white hover:bg-white/30 border-0 gap-2 shrink-0"
              onClick={handleJoinWaitlist}
              disabled={waitlistLoading}
            >
              {waitlistLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Join Waitlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
