"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { mockTasks, mockTeamMembers } from "@/data/mock-data"
import { formatDate } from "@/lib/utils"
import type { Task } from "@/types"
import { Plus, Search, Trash2, CheckSquare, ClipboardList, AlertCircle, CheckCircle2, X, Clock, ArrowUp, Zap } from "lucide-react"

const priorities = ["All", "Low", "Medium", "High", "Urgent"] as const
const taskStatuses = ["All", "Pending", "In Progress", "Completed", "Cancelled"] as const

const priorityColors: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-blue-100 text-blue-700 border-blue-200",
  Low: "bg-gray-100 text-gray-600 border-gray-200",
}

const taskStatusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
}

const emptyTask: Omit<Task, "id" | "createdAt"> = {
  title: "",
  description: "",
  relatedTo: "",
  relatedType: "Opportunity",
  assignedTo: "",
  priority: "Medium",
  status: "Pending",
  dueDate: new Date().toISOString().slice(0, 10),
}

export default function TasksPage() {
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [form, setForm] = useState(emptyTask)

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter
      const matchStatus = statusFilter === "All" || t.status === statusFilter
      return matchSearch && matchPriority && matchStatus
    })
  }, [tasks, search, priorityFilter, statusFilter])

  const counts = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    pending: tasks.filter((t) => t.status === "Pending" || t.status === "In Progress").length,
    overdue: tasks.filter((t) => t.status !== "Completed" && t.status !== "Cancelled" && new Date(t.dueDate) < new Date()).length,
  }), [tasks])

  const getTeamMemberName = (id: string) => {
    const m = mockTeamMembers.find((tm) => tm.id === id)
    return m ? m.name : "Unassigned"
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((t) => t.id)))
  }

  const toggleComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" as Task["status"] } : t))
  }

  const handleBulkComplete = () => {
    setTasks((prev) => prev.map((t) => selected.has(t.id) ? { ...t, status: "Completed" as Task["status"] } : t))
    setSelected(new Set())
  }

  const handleBulkDelete = () => {
    setTasks((prev) => prev.filter((t) => !selected.has(t.id)))
    setSelected(new Set())
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description,
      relatedTo: task.relatedTo,
      relatedType: task.relatedType,
      assignedTo: task.assignedTo,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate.slice(0, 10),
    })
    setFormOpen(true)
  }

  const handleSave = () => {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => t.id === editingTask.id ? { ...t, ...form } : t))
    } else {
      const newTask: Task = {
        ...form,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setTasks((prev) => [newTask, ...prev])
    }
    setForm(emptyTask)
    setEditingTask(null)
    setFormOpen(false)
  }

  const hasFilters = search || priorityFilter !== "All" || statusFilter !== "All"
  const clearFilters = () => {
    setSearch("")
    setPriorityFilter("All")
    setStatusFilter("All")
  }

  const summaryCards = [
    { label: "Total Tasks", value: counts.total, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Completed", value: counts.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "In Progress", value: counts.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Overdue", value: counts.overdue, icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team tasks and follow-ups</p>
        </div>
        <Button variant="premium" size="xl" className="gap-2" onClick={() => { setEditingTask(null); setForm(emptyTask); setFormOpen(true) }}>
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search tasks..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>{p === "All" ? "All Priorities" : p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taskStatuses.map((s) => (
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

      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-1">
          <span className="text-sm text-gray-500">{selected.size} selected</span>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleBulkComplete}>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Mark Completed
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-red-600" onClick={handleBulkDelete}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filtered.length}</span> task{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox checked={filtered.length > 0 && selected.size === filtered.length} onCheckedChange={toggleSelectAll} />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CheckSquare className="h-10 w-10 text-gray-300" />
                      <p className="text-sm font-medium text-gray-500">No tasks found</p>
                      <p className="text-xs text-gray-400">
                        {hasFilters ? "Try adjusting your filters" : "Create your first task to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((task) => (
                  <TableRow key={task.id} className={selected.has(task.id) ? "bg-blue-50/50" : ""}>
                    <TableCell>
                      <Checkbox checked={selected.has(task.id)} onCheckedChange={() => toggleSelect(task.id)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleComplete(task.id)} className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${task.status === "Completed" ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 hover:border-emerald-400"}`}>
                          {task.status === "Completed" && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </button>
                        <div>
                          <p className={`text-sm font-medium ${task.status === "Completed" ? "text-gray-400 line-through" : "text-gray-900"}`}>{task.title}</p>
                          {task.description && <p className="text-xs text-gray-400 truncate max-w-[200px]">{task.description}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.relatedTo ? (
                        <span className="text-sm text-gray-600">{task.relatedType}: {task.relatedTo}</span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-500">
                          {getTeamMemberName(task.assignedTo).split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <span className="text-sm text-gray-600">{getTeamMemberName(task.assignedTo)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] font-medium px-2 py-0.5 border ${priorityColors[task.priority] || ""}`}>
                        {task.priority === "Urgent" && <Zap className="h-2.5 w-2.5 mr-0.5 inline" />}
                        {task.priority === "High" && <ArrowUp className="h-2.5 w-2.5 mr-0.5 inline" />}
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] font-medium px-2 py-0.5 border ${taskStatusColors[task.status] || ""}`}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <span className={new Date(task.dueDate) < new Date() && task.status !== "Completed" && task.status !== "Cancelled" ? "text-red-600 font-medium" : ""}>
                        {formatDate(task.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(task)}>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Zap className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-xs text-gray-400">Powered by <span className="font-medium text-gray-500">Mufar Tasks</span></span>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => { if (!open) { setFormOpen(false); setEditingTask(null) } }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
            <DialogDescription>{editingTask ? "Update task details." : "Create a new task."}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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
                  {mockTeamMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Task["priority"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Task["status"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setFormOpen(false); setEditingTask(null) }}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title}>{editingTask ? "Save Changes" : "Create Task"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
