"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Plug,
  CheckCircle2,
  Zap,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  Code,
  Link2,
  Unlink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { mockIntegrations } from "@/data/mock-data"
import type { Integration } from "@/types"
import { cn } from "@/lib/utils"

const categoryMeta: Record<string, { icon: typeof Plug; color: string; bg: string; label: string }> = {
  "Mufar Native": { icon: Plug, color: "text-blue-600", bg: "bg-blue-50", label: "Mufar Ecosystem" },
  "Email": { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50", label: "Communication" },
  "Calendar": { icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50", label: "Calendar" },
  "Communication": { icon: Users, color: "text-amber-600", bg: "bg-amber-50", label: "Collaboration" },
  "Video Conferencing": { icon: Users, color: "text-cyan-600", bg: "bg-cyan-50", label: "Video Conferencing" },
  "Automation": { icon: Zap, color: "text-rose-600", bg: "bg-rose-50", label: "Automation" },
  "Developer Tools": { icon: Code, color: "text-gray-600", bg: "bg-gray-50", label: "Development" },
  "CRM": { icon: Settings, color: "text-indigo-600", bg: "bg-indigo-50", label: "CRM" },
}

const categoryOrder = ["Mufar Native", "Email", "Calendar", "Communication", "Video Conferencing", "Automation", "Developer Tools", "CRM"]

function IntegrationCard({ integration }: { integration: Integration }) {
  const [connected, setConnected] = useState(integration.connected)
  const meta = categoryMeta[integration.category]
  const Icon = meta?.icon || Plug

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
      connected ? "border-emerald-200/50" : "border-gray-100"
    )}>
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        connected ? "bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent" : "bg-gradient-to-br from-gray-50/50 via-transparent to-transparent"
      )} />
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", meta?.bg || "bg-gray-50")}>
            <Icon className={cn("h-5 w-5", meta?.color || "text-gray-500")} />
          </div>
          {connected ? (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                Connected
              </Badge>
            </div>
          ) : (
            <Badge variant="secondary" className="text-[10px]">Not connected</Badge>
          )}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{integration.name}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 min-h-[2.5rem]">{integration.description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn("text-[10px] border", meta?.bg || "bg-gray-50", meta?.color || "text-gray-500")}>
            {meta?.label || integration.category}
          </Badge>
          {connected ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              onClick={() => setConnected(false)}
            >
              <Unlink className="h-3.5 w-3.5" />
              Disconnect
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="gap-1.5"
              onClick={() => setConnected(true)}
            >
              <Link2 className="h-3.5 w-3.5" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function IntegrationsPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filtered = useMemo(() => {
    let list = mockIntegrations
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
    }
    if (activeCategory !== "all") {
      list = list.filter((i) => i.category === activeCategory)
    }
    return list
  }, [search, activeCategory])

  const grouped = useMemo(() => {
    const map: Record<string, Integration[]> = {}
    for (const cat of categoryOrder) {
      const items = filtered.filter((i) => i.category === cat)
      if (items.length > 0) map[cat] = items
    }
    return map
  }, [filtered])

  const totalConnected = mockIntegrations.filter((i) => i.connected).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalConnected} of {mockIntegrations.length} integrations connected
          </p>
        </div>
        <Button variant="premium" className="gap-2">
          <Plug className="h-4 w-4" />
          Connect
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search integrations..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
              <TabsList className="bg-gray-50 border border-gray-100">
                <TabsTrigger value="all">All</TabsTrigger>
                {categoryOrder.map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="whitespace-nowrap">
                    {categoryMeta[cat]?.label || cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {Object.entries(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Plug className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No integrations found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => {
          const meta = categoryMeta[category]
          const CatIcon = meta?.icon || Plug
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", meta?.bg || "bg-gray-50")}>
                  <CatIcon className={cn("h-4 w-4", meta?.color || "text-gray-500")} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{meta?.label || category}</h2>
                <Badge variant="secondary" className="text-[10px]">{items.length} integration{items.length !== 1 ? "s" : ""}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {items.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
