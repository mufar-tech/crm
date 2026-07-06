"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDate, getInitials } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import type { Activity } from "@/types"
import { Plus, Phone, Mail, Calendar, Bell, FileText, CheckSquare, X, Clock, ArrowRight, Filter, Loader2 } from "lucide-react"

const activityTypes = ["All", "Call", "Email", "Meeting", "Follow-up", "Note", "Task"] as const
const statuses = ["All", "Completed", "Scheduled", "Overdue"] as const

const typeConfig: Record<string, { icon: typeof Phone; color: string; bg: string }> = {
  Call: { icon: Phone, color: "text-blue-600", bg: "bg-blue-100" },
  Email: { icon: Mail, color: "text-purple-600", bg: "bg-purple-100" },
  Meeting: { icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-100" },
  "Follow-up": { icon: Bell, color: "text-amber-600", bg: "bg-amber-100" },
  Note: { icon: FileText, color: "text-rose-600", bg: "bg-rose-100" },
  Task: { icon: CheckSquare, color: "text-cyan-600", bg: "bg-cyan-100" },
}

const statusBadgeStyles: Record<string, string> = {
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  Overdue: "bg-red-100 text-red-700 border-red-200",
}

const emptyActivity: Omit<Activity, "id" | "createdAt"> = {
  type: "Call",
  subject: "",
  description: "",
  relatedTo: "",
  relatedType: "Opportunity",
  assignedTo: "",
  status: "Scheduled",
  date: new Date().toISOString().slice(0, 16),
}

function groupByDate(activities: any[]) {
  const groups: Record<string, any[]> = {}
  for (const act of activities) {
    const key = formatDate(act.date)
    if (!groups[key]) groups[key] = []
    groups[key].push(act)
  }
  return Object.entries(groups).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
}

export default function ActivitiesPage() {
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyActivity)
  const { fetchWithAuth } = useAuth()

  useEffect(() => {
    Promise.all([
      fetchWithAuth("/api/activities"),
      fetchWithAuth("/api/team"),
    ]).then(([activitiesData, teamData]) => {
      setActivities(activitiesData)
      setTeamMembers(teamData)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const matchType = typeFilter === "All" || a.type === typeFilter
      const matchStatus = statusFilter === "All" || a.status === statusFilter
      const matchSearch =
        !search ||
        a.subject.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase())
      return matchType && matchStatus && matchSearch
    })
  }, [activities, typeFilter, statusFilter, search])

  const grouped = useMemo(() => groupByDate(filtered), [filtered])

  const getTeamMemberName = (id: string) => {
    const m = teamMembers.find((tm: any) => tm.id === id)
    return m ? m.name : "Unassigned"
  }

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>

  const handleAdd = async () => {
    try {
      const created = await fetchWithAuth("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setActivities((prev) => [created, ...prev])
    } catch (e) {
      console.error("Failed to add activity", e)
    }
    setForm(emptyActivity)
    setFormOpen(false)
  }

  const hasFilters = typeFilter !== "All" || statusFilter !== "All" || search
  const clearFilters = () => {
    setTypeFilter("All")
    setStatusFilter("All")
    setSearch("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Activities</h1>
          <p className="text-sm text-gray-500 mt-1">Track all your team interactions</p>
        </div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button variant="premium" size="xl" className="gap-2">
              <Plus className="h-4 w-4" />
              Log Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Log Activity</DialogTitle>
              <DialogDescription>Record a new activity interaction.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Activity["type"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.filter((t) => t !== "All").map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Activity["status"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.filter((s) => s !== "All").map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <Input placeholder="Activity subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500" placeholder="Add details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Related Type</label>
                <Select value={form.relatedType} onValueChange={(v) => setForm({ ...form, relatedType: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Opportunity">Opportunity</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Contact">Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Related To</label>
                <Input placeholder="ID or name" value={form.relatedTo} onChange={(e) => setForm({ ...form, relatedTo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Assigned To</label>
                <Select value={form.assignedTo} onValueChange={(v) => setForm({ ...form, assignedTo: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((m: any) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date & Time</label>
                <Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAdd} disabled={!form.subject}>Log Activity</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative flex-1 w-full">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search activities..." className="pl-9 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t === "All" ? "All Types" : t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s === "All" ? "All Statuses" : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filtered.length}</span> activit{filtered.length === 1 ? "y" : "ies"}
        </p>
      </div>

      {grouped.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-sm font-medium text-gray-500">No activities found</p>
            <p className="text-xs text-gray-400 mt-1">
              {hasFilters ? "Try adjusting your filters" : "Log your first activity to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-purple-200 to-gray-200" />
          <div className="space-y-8">
            {grouped.map(([date, acts]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{date}</h3>
                  <Separator className="flex-1" />
                </div>
                <div className="ml-10 sm:ml-14 space-y-3 sm:space-y-4">
                  {acts.map((activity) => {
                    const Icon = typeConfig[activity.type]?.icon || FileText
                    const iconColor = typeConfig[activity.type]?.color || "text-gray-600"
                    const iconBg = typeConfig[activity.type]?.bg || "bg-gray-100"
                    return (
                      <Card key={activity.id || activity._id} className="group relative overflow-hidden transition-all hover:shadow-md border-l-4" style={{ borderLeftColor: activity.status === "Completed" ? "#10b981" : activity.status === "Scheduled" ? "#3b82f6" : "#ef4444" }}>
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start gap-2 sm:gap-4">
                            <div className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{activity.subject}</p>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{activity.description}</p>
                                </div>
                                <Badge className={`shrink-0 text-[10px] font-medium px-2 py-0.5 border ${statusBadgeStyles[activity.status] || ""}`}>
                                  {activity.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(activity.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                </span>
                                {activity.relatedTo && (
                                  <span className="flex items-center gap-1">
                                    <ArrowRight className="h-3 w-3" />
                                    {activity.relatedType}: {activity.relatedTo}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <div className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-[8px] font-medium text-gray-500">{getInitials(getTeamMemberName(activity.assignedTo))}</span>
                                  </div>
                                  {getTeamMemberName(activity.assignedTo)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
