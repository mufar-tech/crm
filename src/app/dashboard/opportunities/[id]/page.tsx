"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  DollarSign,
  Target,
  Calendar,
  Clock,
  TrendingUp,
  ChevronRight,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  ActivityIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { mockOpportunities, mockActivities, mockTeamMembers } from "@/data/mock-data"
import type { PipelineStage } from "@/types"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"

const stageOrder: PipelineStage[] = ["Lead", "Qualification", "Discovery", "Proposal", "Negotiation", "Won", "Lost"]

export default function OpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [opportunity, setOpportunity] = useState(() => mockOpportunities.find((o) => o.id === id))

  const owner = useMemo(
    () => mockTeamMembers.find((m) => m.id === opportunity?.owner),
    [opportunity]
  )

  const daysOpen = useMemo(() => {
    if (!opportunity) return 0
    const created = new Date(opportunity.createdAt)
    const now = new Date()
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  }, [opportunity])

  const activityList = useMemo(
    () => mockActivities.filter((a) => a.relatedTo === id),
    [id]
  )

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-lg text-gray-500">Opportunity not found</p>
        <Link href="/opportunities">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Opportunities
          </Button>
        </Link>
      </div>
    )
  }

  function handleMoveToNextStage() {
    if (!opportunity) return
    const idx = stageOrder.indexOf(opportunity.stage)
    if (idx < stageOrder.length - 1) {
      const nextStage = stageOrder[idx + 1]
      setOpportunity((prev) => prev ? { ...prev, stage: nextStage } : prev)
    }
  }

  function handleStageChange(stage: PipelineStage) {
    setOpportunity((prev) => prev ? { ...prev, stage } : prev)
  }

  const currentStageIndex = stageOrder.indexOf(opportunity.stage)
  const canMoveForward = currentStageIndex < stageOrder.length - 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{opportunity.name}</h1>
            <Badge className={getStatusColor(opportunity.stage)} variant="secondary">{opportunity.stage}</Badge>
          </div>
          <p className="text-sm text-gray-500">{opportunity.customer}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="premium"
            className="gap-2"
            onClick={handleMoveToNextStage}
            disabled={!canMoveForward}
          >
            Move to Next Stage
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Value</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{formatCurrency(opportunity.dealValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2.5">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{opportunity.probability}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Close</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{formatDate(opportunity.expectedCloseDate)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2.5">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Days Open</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{daysOpen} days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="overview" className="gap-2">
            <FileText className="h-4 w-4 shrink-0" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <ActivityIcon className="h-4 w-4 shrink-0" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <MessageSquare className="h-4 w-4 shrink-0" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Deal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Deal Value</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(opportunity.dealValue)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Stage</span>
                  <Badge className={getStatusColor(opportunity.stage)} variant="secondary">{opportunity.stage}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Probability</span>
                  <div className="flex items-center gap-2">
                    <Progress value={opportunity.probability} className="h-1.5 w-20" />
                    <span className="text-sm font-medium text-gray-900">{opportunity.probability}%</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Expected Close</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(opportunity.expectedCloseDate)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(opportunity.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Customer & Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Customer</span>
                  <span className="text-sm font-medium text-gray-900">{opportunity.customer}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Owner</span>
                  <span className="text-sm font-medium text-gray-900">{owner?.name || opportunity.owner}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Owner Email</span>
                  <span className="text-sm font-medium text-gray-900">{owner?.email || "-"}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Owner Role</span>
                  <span className="text-sm font-medium text-gray-900">{owner?.role || "-"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Stage Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                {stageOrder.map((stage, idx) => (
                  <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleStageChange(stage)}
                      className={`w-full h-2 rounded-full transition-colors cursor-pointer ${
                        idx <= currentStageIndex ? "bg-blue-600" : "bg-gray-200"
                      } ${idx === currentStageIndex ? "ring-2 ring-blue-300" : ""}`}
                    />
                    <span className={`text-[10px] font-medium ${
                      idx <= currentStageIndex ? "text-blue-600" : "text-gray-400"
                    }`}>
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {activityList.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No activities recorded</p>
              ) : (
                <div className="space-y-4">
                  {activityList.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`rounded-full p-1.5 mt-0.5 ${
                        activity.type === "Call" ? "bg-green-50 text-green-600" :
                        activity.type === "Email" ? "bg-blue-50 text-blue-600" :
                        activity.type === "Meeting" ? "bg-purple-50 text-purple-600" :
                        activity.type === "Follow-up" ? "bg-amber-50 text-amber-600" :
                        "bg-gray-50 text-gray-600"
                      }`}>
                        {activity.type === "Call" ? <Phone className="h-3.5 w-3.5" /> :
                         activity.type === "Email" ? <Mail className="h-3.5 w-3.5" /> :
                         activity.type === "Meeting" ? <Users className="h-3.5 w-3.5" /> :
                         activity.type === "Follow-up" ? <TrendingUp className="h-3.5 w-3.5" /> :
                         <FileText className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.subject}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-400">{formatDate(activity.date)}</span>
                          <Badge variant="secondary" className={`text-[10px] ${
                            activity.status === "Completed" ? "bg-emerald-50 text-emerald-700" :
                            activity.status === "Scheduled" ? "bg-blue-50 text-blue-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {opportunity.notes ? (
                <p className="text-sm text-gray-700 leading-relaxed">{opportunity.notes}</p>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No notes added</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
