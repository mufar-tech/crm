"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Search,
  Eye,
  Trash2,
  X,
  Filter,
  Users,
} from "lucide-react"
import { mockLeads, mockTeamMembers } from "@/data/mock-data"
import { getStatusColor, formatDate } from "@/lib/utils"
import type { Lead, LeadStatus } from "@/types"
import Link from "next/link"

const statuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
]

const sources = ["Website", "Referral", "LinkedIn", "Mufar Forms", "Email Campaign", "Cold Call", "Social Media"]
const industries = ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Education", "Real Estate"]

const emptyLead: Omit<Lead, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  company: "",
  email: "",
  phone: "",
  source: "",
  industry: "",
  score: 0,
  status: "New",
  assignedTo: "",
  notes: "",
}

export default function LeadsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [sourceFilter, setSourceFilter] = useState<string>("All")
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyLead)

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.company.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter
      const matchesSource = sourceFilter === "All" || lead.source === sourceFilter
      return matchesSearch && matchesStatus && matchesSource
    })
  }, [leads, search, statusFilter, sourceFilter])

  const handleDelete = () => {
    if (deleteId) {
      setLeads((prev) => prev.filter((l) => l.id !== deleteId))
      setDeleteId(null)
    }
  }

  const handleAddLead = () => {
    const newLead: Lead = {
      ...form,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setLeads((prev) => [newLead, ...prev])
    setForm(emptyLead)
    setFormOpen(false)
  }

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("All")
    setSourceFilter("All")
  }

  const hasFilters = search || statusFilter !== "All" || sourceFilter !== "All"

  const getTeamMemberName = (id: string) => {
    const member = mockTeamMembers.find((m) => m.id === id)
    return member ? member.name : "Unassigned"
  }

  return (
    <div className="space-y-6">
      <div className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your leads</p>
        </div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button variant="premium" size="xl" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-full sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>Fill in the lead details below.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company</label>
                <Input
                  placeholder="Company name"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  placeholder="Email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <Input
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Source</label>
                <Select
                  value={form.source}
                  onValueChange={(v) => setForm({ ...form, source: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Industry</label>
                <Select
                  value={form.industry}
                  onValueChange={(v) => setForm({ ...form, industry: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Score</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0-100"
                  value={form.score || ""}
                  onChange={(e) => setForm({ ...form, score: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(v: LeadStatus) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Assigned To</label>
                <Select
                  value={form.assignedTo}
                  onValueChange={(v) => setForm({ ...form, assignedTo: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  placeholder="Add notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddLead} disabled={!form.name || !form.email}>
                Add Lead
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search leads by name, company or email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sources</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filteredLeads.length}</span> lead{filteredLeads.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-10 w-10 text-gray-300" />
                      <p className="text-sm font-medium text-gray-500">No leads found</p>
                      <p className="text-xs text-gray-400">
                        {hasFilters ? "Try adjusting your filters" : "Add your first lead to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <span className="font-medium text-gray-900">{lead.name}</span>
                    </TableCell>
                    <TableCell className="text-gray-600">{lead.company}</TableCell>
                    <TableCell className="text-gray-600">{lead.email}</TableCell>
                    <TableCell className="text-gray-600">{lead.phone}</TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{lead.source}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={lead.score} className="w-16" />
                        <span className="text-sm font-medium text-gray-700">{lead.score}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)} variant="secondary">
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{getTeamMemberName(lead.assignedTo)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDeleteId(lead.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table></div>
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
