"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Plus, Search, MoreHorizontal, ArrowUpDown, Eye, Trash2, User, Building2, DollarSign, Target, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
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
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { mockOpportunities, mockCompanies, mockTeamMembers } from "@/data/mock-data"
import type { PipelineStage, Opportunity } from "@/types"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"

const stages: PipelineStage[] = ["Lead", "Qualification", "Discovery", "Proposal", "Negotiation", "Won", "Lost"]

const stageOptions = [
  { value: "all", label: "All Stages" },
  ...stages.map((s) => ({ value: s, label: s })),
]

const ownerOptions = [
  { value: "all", label: "All Owners" },
  ...mockTeamMembers.map((m) => ({ value: m.id, label: m.name })),
]

const customerOptions = [
  { value: "", label: "Select customer" },
  ...mockCompanies.map((c) => ({ value: c.id, label: c.name })),
]

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities)
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [ownerFilter, setOwnerFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const [form, setForm] = useState({
    name: "",
    customerId: "",
    dealValue: "",
    stage: "Lead" as PipelineStage,
    ownerId: "",
    expectedCloseDate: "",
    probability: 0,
    notes: "",
  })

  const filtered = useMemo(() => {
    let items = [...opportunities]
    if (search) {
      const q = search.toLowerCase()
      items = items.filter((o) => o.name.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q))
    }
    if (stageFilter !== "all") items = items.filter((o) => o.stage === stageFilter)
    if (ownerFilter !== "all") items = items.filter((o) => o.owner === ownerFilter)
    if (sortField) {
      items.sort((a, b) => {
        let cmp = 0
        if (sortField === "dealValue") cmp = a.dealValue - b.dealValue
        else if (sortField === "name") cmp = a.name.localeCompare(b.name)
        else if (sortField === "customer") cmp = a.customer.localeCompare(b.customer)
        else if (sortField === "stage") cmp = a.stage.localeCompare(b.stage)
        else if (sortField === "owner") cmp = a.owner.localeCompare(b.owner)
        else if (sortField === "expectedCloseDate") cmp = new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime()
        else if (sortField === "probability") cmp = a.probability - b.probability
        return sortDir === "asc" ? cmp : -cmp
      })
    }
    return items
  }, [opportunities, search, stageFilter, ownerFilter, sortField, sortDir])

  const totalValue = useMemo(() => filtered.reduce((sum, o) => sum + o.dealValue, 0), [filtered])
  const avgDealSize = useMemo(() => (filtered.length > 0 ? totalValue / filtered.length : 0), [filtered, totalValue])

  function toggleSort(field: string) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  function SortIcon({ field }: { field: string }) {
    return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-50" />
  }

  function handleAdd() {
    const owner = mockTeamMembers.find((m) => m.id === form.ownerId)
    const company = mockCompanies.find((c) => c.id === form.customerId)
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      name: form.name,
      customer: company?.name || "",
      customerId: form.customerId,
      dealValue: Number.parseFloat(form.dealValue) || 0,
      stage: form.stage,
      owner: form.ownerId,
      expectedCloseDate: form.expectedCloseDate ? new Date(form.expectedCloseDate).toISOString() : new Date().toISOString(),
      probability: form.probability,
      notes: form.notes,
      createdAt: new Date().toISOString(),
    }
    setOpportunities((prev) => [newOpp, ...prev])
    setDialogOpen(false)
    setForm({ name: "", customerId: "", dealValue: "", stage: "Lead", ownerId: "", expectedCloseDate: "", probability: 0, notes: "" })
  }

  function handleDelete(id: string) {
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  function getOwnerName(ownerId: string) {
    const member = mockTeamMembers.find((m) => m.id === ownerId)
    return member?.name || ownerId
  }

  return (
    <div className="space-y-6">
      <div className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your sales opportunities</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Opportunity
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pipeline Value</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{formatCurrency(totalValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2.5">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Opportunities</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{filtered.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Average Deal Size</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{formatCurrency(avgDealSize)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full sm:flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stageOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ownerOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                  Name <SortIcon field="name" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("customer")}>
                  Customer <SortIcon field="customer" />
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => toggleSort("dealValue")}>
                  Deal Value <SortIcon field="dealValue" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("stage")}>
                  Stage <SortIcon field="stage" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("owner")}>
                  Owner <SortIcon field="owner" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("expectedCloseDate")}>
                  Expected Close <SortIcon field="expectedCloseDate" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("probability")}>
                  Probability <SortIcon field="probability" />
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    No opportunities found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((opp) => (
                  <TableRow key={opp.id}>
                    <TableCell className="font-medium text-gray-900">{opp.name}</TableCell>
                    <TableCell>{opp.customer}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(opp.dealValue)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(opp.stage)} variant="secondary">
                        {opp.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{getOwnerName(opp.owner)}</TableCell>
                    <TableCell className="text-gray-600">{formatDate(opp.expectedCloseDate)}</TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <Progress value={opp.probability} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-gray-600 w-8 text-right">{opp.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/opportunities/${opp.id}`}>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="gap-2 text-red-600 cursor-pointer"
                            onClick={() => { setDeleteTarget(opp.id); setDeleteDialogOpen(true) }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table></div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Opportunity</DialogTitle>
            <DialogDescription>Create a new sales opportunity</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Opportunity name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={form.customerId} onValueChange={(v) => setForm((f) => ({ ...f, customerId: v }))}>
                <SelectTrigger id="customer"><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {customerOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dealValue">Deal Value ($)</Label>
                <Input id="dealValue" type="number" value={form.dealValue} onChange={(e) => setForm((f) => ({ ...f, dealValue: e.target.value }))} placeholder="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stage">Stage</Label>
                <Select value={form.stage} onValueChange={(v: PipelineStage) => setForm((f) => ({ ...f, stage: v }))}>
                  <SelectTrigger id="stage"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="owner">Owner</Label>
                <Select value={form.ownerId} onValueChange={(v) => setForm((f) => ({ ...f, ownerId: v }))}>
                  <SelectTrigger id="owner"><SelectValue placeholder="Select owner" /></SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="closeDate">Expected Close Date</Label>
                <Input id="closeDate" type="date" value={form.expectedCloseDate} onChange={(e) => setForm((f) => ({ ...f, expectedCloseDate: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Probability: {form.probability}%</Label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.probability}
                onChange={(e) => setForm((f) => ({ ...f, probability: Number.parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name || !form.customerId || !form.ownerId}>Create Opportunity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Opportunity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this opportunity? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
