"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockCommunications } from "@/data/mock-data"
import { formatDate } from "@/lib/utils"
import type { Communication } from "@/types"
import { Plus, Mail, Video, Phone, StickyNote, MessageSquare, Search, ArrowRight, X, Inbox } from "lucide-react"

const typeIcons: Record<string, typeof Mail> = {
  Email: Mail,
  Meeting: Video,
  Call: Phone,
  Note: StickyNote,
  Comment: MessageSquare,
}

const typeColors: Record<string, string> = {
  Email: "bg-purple-100 text-purple-600",
  Meeting: "bg-emerald-100 text-emerald-600",
  Call: "bg-blue-100 text-blue-600",
  Note: "bg-rose-100 text-rose-600",
  Comment: "bg-amber-100 text-amber-600",
}

const typeBadgeColors: Record<string, string> = {
  Email: "bg-purple-100 text-purple-700 border-purple-200",
  Meeting: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Call: "bg-blue-100 text-blue-700 border-blue-200",
  Note: "bg-rose-100 text-rose-700 border-rose-200",
  Comment: "bg-amber-100 text-amber-700 border-amber-200",
}

const commTypes = ["All", "Email", "Meeting", "Call", "Note", "Comment"] as const

const emptyComm: Omit<Communication, "id"> = {
  type: "Email",
  subject: "",
  content: "",
  from: "",
  to: "",
  relatedTo: "",
  relatedType: "Opportunity",
  date: new Date().toISOString(),
}

export default function CommunicationsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [formOpen, setFormOpen] = useState(false)
  const [comms, setComms] = useState<Communication[]>(mockCommunications)
  const [form, setForm] = useState(emptyComm)

  const filtered = useMemo(() => {
    return comms.filter((c) => {
      const matchTab = activeTab === "All" || c.type === activeTab
      const matchSearch =
        !search ||
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        c.content.toLowerCase().includes(search.toLowerCase()) ||
        c.from.toLowerCase().includes(search.toLowerCase()) ||
        c.to.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })
  }, [comms, activeTab, search])

  const getTypeIcon = (type: string) => {
    const Icon = typeIcons[type] || Mail
    return <Icon className="h-5 w-5" />
  }

  const getTypeColor = (type: string) => typeColors[type] || "bg-gray-100 text-gray-600"

  const handleAdd = () => {
    const newComm: Communication = {
      ...form,
      id: `comm-${Date.now()}`,
      date: new Date().toISOString(),
    }
    setComms((prev) => [newComm, ...prev])
    setForm(emptyComm)
    setFormOpen(false)
  }

  const hasFilters = !!search
  const clearFilters = () => setSearch("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Communications</h1>
          <p className="text-sm text-gray-500 mt-1">View all your team conversations in one place</p>
        </div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button variant="premium" size="xl" className="gap-2">
              <Plus className="h-4 w-4" />
              New Communication
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New Communication</DialogTitle>
              <DialogDescription>Log a new communication entry.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Communication["type"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commTypes.filter((t) => t !== "All").map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">From</label>
                <Input placeholder="Sender" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">To</label>
                <Input placeholder="Recipient" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">Content</label>
                <textarea className="flex min-h-[120px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500" placeholder="Write content..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Related To</label>
                <Input placeholder="ID or name" value={form.relatedTo} onChange={(e) => setForm({ ...form, relatedTo: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAdd} disabled={!form.subject}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search communications..." className="pl-9 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="overflow-x-auto w-full justify-start">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Email">
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="Meeting">
            <Video className="h-3.5 w-3.5 mr-1.5" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="Call">
            <Phone className="h-3.5 w-3.5 mr-1.5" />
            Calls
          </TabsTrigger>
          <TabsTrigger value="Note">
            <StickyNote className="h-3.5 w-3.5 mr-1.5" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Inbox className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-sm font-medium text-gray-500">No communications found</p>
                <p className="text-xs text-gray-400 mt-1">
                  {hasFilters ? "Try adjusting your search" : "Start a new conversation"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((comm) => {
                const Icon = typeIcons[comm.type] || Mail
                const iconColor = getTypeColor(comm.type)
                return (
                  <Card key={comm.id} className="group transition-all hover:shadow-md hover:border-gray-300">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{comm.subject}</p>
                              <Badge className={`shrink-0 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 border ${typeBadgeColors[comm.type] || ""}`}>
                                {comm.type}
                              </Badge>
                            </div>
                            <span className="shrink-0 text-xs text-gray-400">{formatDate(comm.date)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{comm.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                            <span className="font-medium text-gray-500">{comm.from}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span className="text-gray-500">{comm.to}</span>
                            {comm.relatedTo && (
                              <>
                                <span className="text-gray-300">|</span>
                                <span>{comm.relatedType}: {comm.relatedTo}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
