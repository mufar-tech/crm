"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Globe,
  Calendar,
  UserCheck,
  Trash2,
  UserPlus,
  CheckCircle,
  FileText,
  Activity,
  MessageSquare,
  Edit3,
  Save,
  X,
} from "lucide-react"
import { mockLeads, mockActivities, mockTeamMembers } from "@/data/mock-data"
import { formatDate, formatCurrency, getInitials, getStatusColor } from "@/lib/utils"
import type { Lead, LeadStatus } from "@/types"

const statuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
]

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  const [lead, setLead] = useState<Lead | undefined>(() => mockLeads.find((l) => l.id === leadId))
  const [converted, setConverted] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignTo, setAssignTo] = useState("")
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesText, setNotesText] = useState("")

  if (!lead) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Lead not found</h2>
          <p className="mt-1 text-sm text-gray-500">The lead you are looking for does not exist.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/leads")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
          </Button>
        </div>
      </div>
    )
  }

  const relatedActivities = mockActivities.filter(
    (a) => a.relatedTo === lead.id || a.relatedTo === lead.company
  )

  const handleDelete = () => {
    setDeleteOpen(false)
    router.push("/leads")
  }

  const handleAssign = () => {
    if (assignTo) {
      setLead({ ...lead, assignedTo: assignTo })
    }
    setAssignOpen(false)
    setAssignTo("")
  }

  const handleConvert = () => {
    setConverted(true)
  }

  const startEditingNotes = () => {
    setNotesText(lead.notes)
    setEditingNotes(true)
  }

  const saveNotes = () => {
    setLead({ ...lead, notes: notesText })
    setEditingNotes(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Call":
        return <Phone className="h-4 w-4 text-blue-600" />
      case "Email":
        return <Mail className="h-4 w-4 text-purple-600" />
      case "Meeting":
        return <Calendar className="h-4 w-4 text-emerald-600" />
      case "Follow-up":
        return <UserCheck className="h-4 w-4 text-amber-600" />
      case "Note":
        return <FileText className="h-4 w-4 text-gray-600" />
      case "Task":
        return <CheckCircle className="h-4 w-4 text-indigo-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const teamMemberName = mockTeamMembers.find((m) => m.id === lead.assignedTo)?.name || "Unassigned"

  const communications = [
    { type: "Email", subject: "Initial Outreach", date: lead.createdAt, content: `First contact made with ${lead.name} at ${lead.company}.` },
    { type: "Note", subject: "Lead Qualification", date: lead.updatedAt, content: lead.notes || "No notes recorded." },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => router.push("/leads")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
              {getInitials(lead.name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                <Badge className={getStatusColor(lead.status)} variant="secondary">
                  {lead.status}
                </Badge>
                <Badge variant={lead.score >= 80 ? "default" : lead.score >= 50 ? "warning" : "secondary"}>
                  Score: {lead.score}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{lead.company} &middot; {lead.industry}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {converted ? (
          <Button variant="secondary" disabled className="gap-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <CheckCircle className="h-4 w-4" />
            Converted to Customer
          </Button>
        ) : (
          <Button onClick={handleConvert} className="gap-2">
            <UserCheck className="h-4 w-4" />
            Convert to Customer
          </Button>
        )}
        <Button variant="outline" className="gap-2" onClick={() => setAssignOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Assign Lead
        </Button>
        <Button variant="destructive" className="gap-2" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-4 w-4" />
          Delete Lead
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="overview" className="gap-2 shrink-0">
            <FileText className="h-4 w-4 shrink-0" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2 shrink-0">
            <Activity className="h-4 w-4 shrink-0" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2 shrink-0">
            <Edit3 className="h-4 w-4 shrink-0" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="communications" className="gap-2 shrink-0">
            <MessageSquare className="h-4 w-4 shrink-0" />
            Communications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Lead Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:underline">
                          {lead.email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{lead.phone}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{lead.company}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</p>
                      <span className="text-sm text-gray-900 mt-1 block">{lead.industry}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Score</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={lead.score} className="flex-1" />
                        <span className="text-sm font-semibold text-gray-900">{lead.score}/100</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source</p>
                      <span className="text-sm text-gray-900 mt-1 block">{lead.source}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</p>
                      <span className="text-sm text-gray-900 mt-1 block">{teamMemberName}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{formatDate(lead.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-600 font-medium">Status</p>
                  <Badge className={`mt-1 ${getStatusColor(lead.status)}`} variant="secondary">
                    {lead.status}
                  </Badge>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="text-xs text-purple-600 font-medium">Score Rating</p>
                  <p className="text-lg font-bold text-purple-700 mt-1">
                    {lead.score >= 80 ? "Hot" : lead.score >= 50 ? "Warm" : "Cold"}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-xs text-emerald-600 font-medium">Engagement</p>
                  <p className="text-lg font-bold text-emerald-700 mt-1">
                    {relatedActivities.length} Activities
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {relatedActivities.length > 0 ? (
                <div className="space-y-0">
                  {relatedActivities
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((activity, index) => (
                      <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                        {index < relatedActivities.length - 1 && (
                          <div className="absolute left-[19px] top-10 h-full w-px bg-gray-200" />
                        )}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{activity.subject}</p>
                            <Badge
                              variant={
                                activity.status === "Completed"
                                  ? "success"
                                  : activity.status === "Scheduled"
                                    ? "warning"
                                    : "destructive"
                              }
                              className="shrink-0 text-[10px]"
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.type} &middot; {formatDate(activity.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Activity className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No activities recorded for this lead</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Notes</CardTitle>
              {editingNotes ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingNotes(false)} className="gap-1">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveNotes} className="gap-1">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={startEditingNotes} className="gap-1">
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingNotes ? (
                <textarea
                  className="flex min-h-[200px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                />
              ) : (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {lead.notes || "No notes recorded for this lead."}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    Last updated {formatDate(lead.updatedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              {communications.length > 0 ? (
                <div className="space-y-4">
                  {communications.map((comm, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {comm.type}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900">{comm.subject}</span>
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(comm.date)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{comm.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <MessageSquare className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No communications recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {lead.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign Lead</DialogTitle>
            <DialogDescription>
              Select a team member to assign this lead to.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={assignTo || lead.assignedTo} onValueChange={setAssignTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {mockTeamMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <span>{m.name}</span>
                      <span className="text-xs text-gray-400">({m.role})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
