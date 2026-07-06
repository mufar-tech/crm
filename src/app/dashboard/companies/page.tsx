"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, MoreHorizontal, Eye, Trash2, Building2, Globe, Target, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Company } from "@/types"
import { getInitials, formatNumber } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function CompaniesPage() {
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchWithAuth } = useAuth()

  useEffect(() => {
    fetchWithAuth("/api/companies").then(setCompanies).catch(console.error).finally(() => setLoading(false))
  }, [])

  const [form, setForm] = useState({
    name: "",
    industry: "",
    website: "",
    revenue: "",
    employees: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
  })

  const filtered = useMemo(() => {
    return companies.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [companies, search])

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>

  async function handleAdd() {
    try {
      const created = await fetchWithAuth("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, employees: Number(form.employees) || 0, status: "Active" }),
      })
      setCompanies((prev) => [created, ...prev])
    } catch (e) {
      console.error("Failed to add company", e)
    }
    setForm({ name: "", industry: "", website: "", revenue: "", employees: "", address: "", city: "", country: "", phone: "", email: "" })
    setAddOpen(false)
  }

  async function handleDelete(id: string) {
    try {
      await fetchWithAuth(`/api/companies/${id}`, { method: "DELETE" })
      setCompanies((prev) => prev.filter((c) => (c.id || c._id) !== id))
    } catch (e) {
      console.error("Failed to delete company", e)
    }
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your business accounts</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Building2 className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                  className="pl-9 w-full sm:max-w-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No companies found</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {search
                  ? "Try adjusting your search criteria."
                  : "Get started by adding your first company."}
              </p>
              {!search && (
                <Button variant="outline" className="mt-4" onClick={() => setAddOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Company
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto"><Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Company Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Contacts</TableHead>
                  <TableHead>Opportunities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((company) => (
                  <TableRow key={company.id || company._id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm">
                          {getInitials(company.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{company.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{company.industry}</TableCell>
                    <TableCell className="text-gray-600">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span className="text-xs truncate max-w-[120px]">{company.website.replace(/https?:\/\//, "")}</span>
                      </a>
                    </TableCell>
                    <TableCell className="text-gray-600">{company.revenue}</TableCell>
                    <TableCell className="text-gray-600">{formatNumber(company.employees)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        {company.contacts}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                        {company.opportunities}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={company.status === "Active" ? "success" : "secondary"}
                        className="capitalize"
                      >
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/companies/${company.id || company._id}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setDeleteConfirm(company.id || company._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table></div>
          )}
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
            <DialogDescription>Add a new company to your CRM.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  placeholder="Technology"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://acmecorp.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue</Label>
                <Select value={form.revenue} onValueChange={(v) => setForm({ ...form, revenue: v })}>
                  <SelectTrigger id="revenue">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $1M">Under $1M</SelectItem>
                    <SelectItem value="$1M - $10M">$1M - $10M</SelectItem>
                    <SelectItem value="$10M - $50M">$10M - $50M</SelectItem>
                    <SelectItem value="$50M - $100M">$50M - $100M</SelectItem>
                    <SelectItem value="$100M - $500M">$100M - $500M</SelectItem>
                    <SelectItem value="$500M+">$500M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Employees</Label>
              <Input
                id="employees"
                type="number"
                value={form.employees}
                onChange={(e) => setForm({ ...form, employees: e.target.value })}
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Innovation Drive"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="San Francisco"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="USA"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="info@acmecorp.com"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAdd}>Add Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
