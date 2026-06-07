"use client"

import { useState, useMemo } from "react"
import { DollarSign, TrendingUp, BarChart3, Users, Building2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockPipelineItems } from "@/data/mock-data"
import type { PipelineStage } from "@/types"
import { formatCurrency, getStatusColor } from "@/lib/utils"

const stages: PipelineStage[] = ["Lead", "Qualification", "Discovery", "Proposal", "Negotiation", "Won", "Lost"]

const stageAccentColors: Record<PipelineStage, string> = {
  Lead: "border-l-blue-500",
  Qualification: "border-l-purple-500",
  Discovery: "border-l-cyan-500",
  Proposal: "border-l-indigo-500",
  Negotiation: "border-l-orange-500",
  Won: "border-l-emerald-500",
  Lost: "border-l-red-500",
}

const stageHeaderGradients: Record<PipelineStage, string> = {
  Lead: "from-blue-50 to-blue-100/50",
  Qualification: "from-purple-50 to-purple-100/50",
  Discovery: "from-cyan-50 to-cyan-100/50",
  Proposal: "from-indigo-50 to-indigo-100/50",
  Negotiation: "from-orange-50 to-orange-100/50",
  Won: "from-emerald-50 to-emerald-100/50",
  Lost: "from-red-50 to-red-100/50",
}

const stageBadgeColors: Record<PipelineStage, string> = {
  Lead: "bg-blue-100 text-blue-700",
  Qualification: "bg-purple-100 text-purple-700",
  Discovery: "bg-cyan-100 text-cyan-700",
  Proposal: "bg-indigo-100 text-indigo-700",
  Negotiation: "bg-orange-100 text-orange-700",
  Won: "bg-emerald-100 text-emerald-700",
  Lost: "bg-red-100 text-red-700",
}

const stageDotColors: Record<PipelineStage, string> = {
  Lead: "bg-blue-500",
  Qualification: "bg-purple-500",
  Discovery: "bg-cyan-500",
  Proposal: "bg-indigo-500",
  Negotiation: "bg-orange-500",
  Won: "bg-emerald-500",
  Lost: "bg-red-500",
}

const stageTextColors: Record<PipelineStage, string> = {
  Lead: "text-blue-700",
  Qualification: "text-purple-700",
  Discovery: "text-cyan-700",
  Proposal: "text-indigo-700",
  Negotiation: "text-orange-700",
  Won: "text-emerald-700",
  Lost: "text-red-700",
}

export default function PipelinePage() {
  const [items, setItems] = useState(mockPipelineItems)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const columns = useMemo(() => {
    const map: Record<PipelineStage, typeof items> = {
      Lead: [], Qualification: [], Discovery: [], Proposal: [], Negotiation: [], Won: [], Lost: [],
    }
    for (const item of items) {
      if (map[item.stage]) map[item.stage].push(item)
    }
    return map
  }, [items])

  const totalPipelineValue = useMemo(
    () => items.reduce((sum, i) => sum + i.value, 0),
    [items]
  )

  function moveToStage(id: string, stage: PipelineStage) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, stage } : i)))
  }

  function handleDragStart(id: string) {
    setDraggingId(id)
  }

  function handleDrop(stage: PipelineStage) {
    if (draggingId) {
      moveToStage(draggingId, stage)
      setDraggingId(null)
    }
  }

  function handleDragEnd() {
    setDraggingId(null)
  }

  const stageAnalytics = useMemo(() => {
    return stages.map((stage) => {
      const stageItems = columns[stage]
      const totalDeals = stageItems.length
      const totalValue = stageItems.reduce((sum, i) => sum + i.value, 0)
      const avgValue = totalDeals > 0 ? totalValue / totalDeals : 0
      return { stage, totalDeals, totalValue, avgValue }
    })
  }, [columns])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Sales Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} total deals &middot; {formatCurrency(totalPipelineValue)} pipeline value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <BarChart3 className="h-4 w-4" />
            <span className="font-medium text-gray-900">{formatCurrency(totalPipelineValue)}</span>
            <span>total pipeline</span>
          </div>
        </div>
      </div>

      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {stages.map((stage) => {
            const stageItems = columns[stage]
            const stageTotal = stageItems.reduce((sum, i) => sum + i.value, 0)

            return (
              <div
                key={stage}
                className="flex-1 min-w-[180px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stage)}
              >
                <div className={`rounded-xl border border-gray-200 bg-gradient-to-b ${stageHeaderGradients[stage]} p-3 mb-3`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-semibold ${stageTextColors[stage]}`}>{stage}</h3>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${stageBadgeColors[stage]}`}>
                      {stageItems.length}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(stageTotal)}</p>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {stageItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      onDragEnd={handleDragEnd}
                      className={`rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border-l-4 ${stageAccentColors[stage]} group`}
                    >
                      <div className="p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {item.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(item.value)}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            {item.owner}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stageItems.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 p-4 text-center">
                      <p className="text-xs text-gray-400">No deals</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">Stage Analytics</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deals</th>
                  <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                  <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Deal Size</th>
                  <th className="p-3 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {stageAnalytics.map(({ stage, totalDeals, totalValue, avgValue }, idx) => (
                  <tr key={stage} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${idx === stageAnalytics.length - 1 ? "border-b-0" : ""}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${stageDotColors[stage]}`} />
                        <span className="font-medium text-gray-900">{stage}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-medium text-gray-900">{totalDeals}</td>
                    <td className="p-3 text-right font-medium text-gray-900">{formatCurrency(totalValue)}</td>
                    <td className="p-3 text-right text-gray-600">{formatCurrency(avgValue)}</td>
                    <td className="p-3 text-right">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            stage === "Won" ? "bg-emerald-500" :
                            stage === "Lost" ? "bg-red-500" :
                            "bg-blue-500"
                          }`}
                          style={{
                            width: `${totalPipelineValue > 0 ? (totalValue / totalPipelineValue) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
