"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  MoreHorizontal,
  Shield,
  UserCog,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone,
  Building2,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import type { TeamMember, TeamRole } from "@/types"
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"

const roleColorMap: Record<TeamRole, string> = {
  Owner: "bg-purple-100 text-purple-800",
  Admin: "bg-blue-100 text-blue-800",
  "Sales Manager": "bg-emerald-100 text-emerald-800",
  "Sales Representative": "bg-amber-100 text-amber-800",
  "Support Agent": "bg-cyan-100 text-cyan-800",
  Viewer: "bg-gray-100 text-gray-800",
}

const departments = ["Sales", "Marketing", "Operations", "Support", "Engineering", "Finance"]

const allRoles: TeamRole[] = [
  "Owner",
  "Admin",
  "Sales Manager",
  "Sales Representative",
  "Support Agent",
  "Viewer",
]

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editRole, setEditRole] = useState<{ id: string; name: string; currentRole: TeamRole } | null>(null)
  const { fetchWithAuth } = useAuth()

  useEffect(() => {
    fetchWithAuth("/api/team").then(setMembers).catch(console.error).finally(() => setLoading(false))
  }, [])

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Sales Representative" as TeamRole,
    department: "Sales",
  })

  const totalMembers = members.length
  const activeMembers = members.filter((m) => m.status === "Active").length
  const inactiveMembers = members.filter((m) => m.status === "Inactive").length

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>

  async function handleInvite() {
    try {
      const created = await fetchWithAuth("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
          department: form.department,
          status: "Active",
          joinedAt: new Date().toISOString(),
        }),
      })
      setMembers((prev) => [created, ...prev])
    } catch (e) {
      console.error("Failed to invite member", e)
    }
    setForm({ name: "", email: "", role: "Sales Representative", department: "Sales" })
    setInviteOpen(false)
  }

  async function handleRoleChange(id: string, role: TeamRole) {
    try {
      const updated = await fetchWithAuth(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      setMembers((prev) => prev.map((m) => ((m.id || m._id) === id ? updated : m)))
    } catch (e) {
      console.error("Failed to update role", e)
    }
    setEditRole(null)
  }

  async function handleToggleStatus(id: string) {
    const member = members.find((m) => (m.id || m._id) === id)
    if (!member) return
    const newStatus = member.status === "Active" ? "Inactive" : "Active"
    try {
      const updated = await fetchWithAuth(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      setMembers((prev) => prev.map((m) => ((m.id || m._id) === id ? updated : m)))
    } catch (e) {
      console.error("Failed to toggle status", e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Team</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team members and roles</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{totalMembers}</p>
            <p className="text-xs text-gray-500 mt-1">Total Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{activeMembers}</p>
            <p className="text-xs text-gray-500 mt-1">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-gray-100 p-2.5">
                <UserX className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{inactiveMembers}</p>
            <p className="text-xs text-gray-500 mt-1">Inactive</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No team members yet</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Get started by inviting your first team member.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setInviteOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto"><Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Deals</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id || member._id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{member.email}</TableCell>
                    <TableCell>
                      <Badge className={`${roleColorMap[member.role as keyof typeof roleColorMap]} border-0 font-medium`}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{member.department}</TableCell>
                    <TableCell className="text-right text-gray-900 font-medium">{member.leads}</TableCell>
                    <TableCell className="text-right text-gray-900 font-medium">{member.deals}</TableCell>
                    <TableCell className="text-right text-gray-900 font-medium">{formatCurrency(member.revenue)}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === "Active" ? "success" : "secondary"} className="capitalize">
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => setEditRole({ id: member.id || member._id, name: member.name, currentRole: member.role })}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(member.id || member._id)}>
                            {member.status === "Active" ? (
                              <ToggleLeft className="mr-2 h-4 w-4 text-amber-500" />
                            ) : (
                              <ToggleRight className="mr-2 h-4 w-4 text-emerald-500" />
                            )}
                            {member.status === "Active" ? "Deactivate" : "Activate"}
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

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to join your CRM workspace.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@company.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={form.role} onValueChange={(v: TeamRole) => setForm({ ...form, role: v })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {allRoles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editRole} onOpenChange={(open) => !open && setEditRole(null)}>
        <DialogContent className="w-[95vw] sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Change role for {editRole?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="newRole">New Role</Label>
              <Select
                value={editRole?.currentRole || "Viewer"}
                onValueChange={(v: TeamRole) => setEditRole((prev) => prev ? { ...prev, currentRole: v } : null)}
              >
                <SelectTrigger id="newRole">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {allRoles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
                            <Button onClick={() => editRole && handleRoleChange(editRole.id, editRole.currentRole)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
