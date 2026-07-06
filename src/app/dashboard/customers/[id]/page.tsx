"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  DollarSign,
  TrendingUp,
  BarChart3,
  Clock,
  FileText,
  MessageSquare,
  Activity,
  Briefcase,
  CreditCard,
  CheckCircle2,
  Plus,
  Eye,
  ListTodo,
  StickyNote,
  CalendarClock,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { formatCurrency, formatDate, getInitials, cn } from "@/lib/utils"

export default function CustomerDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [customer, setCustomer] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [billing, setBilling] = useState<any[]>([])
  const [communications, setCommunications] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [timeline, setTimeline] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchWithAuth } = useAuth()

  const wonOpps = opportunities.filter((o) => o.stage === "Won")
  const totalDeals = wonOpps.length
  const totalRevenue = wonOpps.reduce((sum, o) => sum + o.dealValue, 0)
  const avgDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0
  const lastActivity = timeline[0]?.date || customer?.updatedAt || ""

  useEffect(() => {
    Promise.all([
      fetchWithAuth(`/api/customers/${id}`),
      fetchWithAuth("/api/opportunities"),
      fetchWithAuth("/api/billing"),
      fetchWithAuth("/api/communications"),
      fetchWithAuth("/api/tasks"),
      fetchWithAuth("/api/activities"),
    ]).then(([customerData, oppsData, billingData, commsData, tasksData, activitiesData]) => {
      setCustomer(customerData)
      const filteredOpps = oppsData.filter((o: any) => o.customerId === customerData?.company || o.customer === customerData?.company)
      setOpportunities(filteredOpps)
      setBilling(billingData.filter((b: any) => b.customerId === customerData?.company || b.customer === customerData?.company))
      const won = filteredOpps.filter((o: any) => o.stage === "Won")
      setCommunications(commsData.filter((c: any) => c.relatedTo === id || won.some((o: any) => o.id === c.relatedTo)))
      setTasks(tasksData.filter((t: any) => t.relatedTo === id || filteredOpps.some((o: any) => o.id === t.relatedTo)))
      setTimeline(activitiesData
        .filter((a: any) => a.relatedTo === id || filteredOpps.some((o: any) => o.id === a.relatedTo))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      )
    }).catch(console.error).finally(() => setLoading(false))
  }, [id])

  const [notes, setNotes] = useState("")
  const [savedNotes, setSavedNotes] = useState<string[]>([])

  async function addNote() {
    if (!notes.trim()) return
    const customerId = customer?.id || customer?._id
    if (!customerId) return
    try {
      const existing = customer.notes || ""
      const updatedNotes = existing ? `${existing}\n---\n${notes.trim()}` : notes.trim()
      const updated = await fetchWithAuth(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: updatedNotes }),
      })
      setCustomer(updated)
      setSavedNotes((prev) => [notes.trim(), ...prev])
    } catch (e) {
      console.error("Failed to save note", e)
    }
    setNotes("")
  }

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-lg text-gray-500">Customer not found</p>
        <Link href="/customers">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Link>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-16 w-16 shrink-0 ring-2 ring-gray-100">
            <AvatarFallback className="text-lg font-semibold">{getInitials(customer.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{customer.name}</h1>
              <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                Customer
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                {customer.company}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {customer.email}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {customer.phone}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deals</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{totalDeals}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2.5">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Deal Size</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{formatCurrency(avgDealSize)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2.5">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{lastActivity ? formatDate(lastActivity) : "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="overview" className="gap-2 shrink-0"><Eye className="h-4 w-4" />Overview</TabsTrigger>
          <TabsTrigger value="opportunities" className="gap-2 shrink-0"><TrendingUp className="h-4 w-4" />Opportunities</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 shrink-0"><CreditCard className="h-4 w-4" />Billing</TabsTrigger>
          <TabsTrigger value="communications" className="gap-2 shrink-0"><MessageSquare className="h-4 w-4" />Communications</TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2 shrink-0"><FileText className="h-4 w-4" />Tasks</TabsTrigger>
          <TabsTrigger value="documents" className="gap-2 shrink-0"><FileText className="h-4 w-4" />Documents</TabsTrigger>
          <TabsTrigger value="notes" className="gap-2 shrink-0"><MessageSquare className="h-4 w-4" />Notes</TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2 shrink-0"><Activity className="h-4 w-4" />Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-gray-500">Name</span><span className="text-sm font-medium text-gray-900">{customer.name}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-sm text-gray-500">Email</span><span className="text-sm font-medium text-gray-900">{customer.email}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-sm text-gray-500">Phone</span><span className="text-sm font-medium text-gray-900">{customer.phone}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-sm text-gray-500">Company</span><span className="text-sm font-medium text-gray-900">{customer.company}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-sm text-gray-500">Industry</span><span className="text-sm font-medium text-gray-900">{customer.industry}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-sm text-gray-500">Source</span><span className="text-sm font-medium text-gray-900">{customer.source}</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-gray-500">Total Deals</span><span className="text-sm font-bold text-gray-900">{totalDeals}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-sm text-gray-500">Total Revenue</span><span className="text-sm font-bold text-gray-900">{formatCurrency(totalRevenue)}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-sm text-gray-500">Avg Deal Size</span><span className="text-sm font-bold text-gray-900">{formatCurrency(avgDealSize)}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-sm text-gray-500">Last Activity</span><span className="text-sm font-medium text-gray-900">{lastActivity ? formatDate(lastActivity) : "N/A"}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-sm text-gray-500">Customer Since</span><span className="text-sm font-medium text-gray-900">{formatDate(customer.createdAt)}</span></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Won Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              {wonOpps.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No won opportunities</p>
              ) : (
                <div className="space-y-3">
                  {wonOpps.map((opp) => (
                    <div key={opp.id || opp._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{opp.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Closed {formatDate(opp.expectedCloseDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(opp.dealValue)}</p>
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] mt-0.5">Won</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              {billing.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No billing records</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {billing.map((bill) => (
                    <div key={bill.id || bill._id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{bill.invoice}</p>
                        <p className="text-xs text-gray-500">{formatDate(bill.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(bill.amount)}</p>
                        <Badge variant={
                          bill.status === "Paid" ? "success" : bill.status === "Pending" ? "secondary" : bill.status === "Overdue" ? "destructive" : "outline"
                        } className="text-[10px] mt-0.5">{bill.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              {communications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No communications recorded</p>
              ) : (
                <div className="space-y-4">
                  {communications.map((comm) => (
                    <div key={comm.id || comm._id} className="flex items-start gap-3">
                      <div className={cn("rounded-full p-1.5 mt-0.5",
                        comm.type === "Email" ? "bg-blue-50 text-blue-600" :
                        comm.type === "Meeting" ? "bg-purple-50 text-purple-600" :
                        comm.type === "Call" ? "bg-green-50 text-green-600" :
                        comm.type === "Comment" ? "bg-amber-50 text-amber-600" :
                        "bg-gray-50 text-gray-600"
                      )}>
                        {comm.type === "Email" ? <Mail className="h-3.5 w-3.5" /> :
                         comm.type === "Call" ? <Phone className="h-3.5 w-3.5" /> :
                         <MessageSquare className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{comm.subject}</p>
                          <span className="text-xs text-gray-400">{formatDate(comm.date)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{comm.content}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{comm.from} &rarr; {comm.to}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Related Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No tasks related to this customer</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id || task._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Due {formatDate(task.dueDate)}</p>
                      </div>
                      <Badge variant={
                        task.priority === "Urgent" ? "destructive" :
                        task.priority === "High" ? "warning" :
                        task.priority === "Medium" ? "secondary" : "outline"
                      } className="text-[10px]">{task.priority}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Documents</CardTitle>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-900">No documents yet</p>
                <p className="text-xs text-gray-500 mt-1">Upload contracts, agreements, or other documents</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <textarea
                  className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  placeholder="Add a note..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={addNote} disabled={!notes.trim()} size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Add Note
                </Button>
              </div>
              {savedNotes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No notes added yet</p>
              ) : (
                <div className="space-y-3 mt-4">
                  {savedNotes.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">Note {savedNotes.length - idx}</span>
                        <span className="text-xs text-gray-400">{formatDate(new Date().toISOString())}</span>
                      </div>
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No activity recorded</p>
              ) : (
                <div className="relative pl-6 space-y-6">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100" />
                  {timeline.map((act) => (
                    <div key={act.id || act._id} className="relative">
                      <div className={cn("absolute -left-[19px] top-1 rounded-full p-1",
                        act.type === "Call" ? "bg-green-50" :
                        act.type === "Email" ? "bg-blue-50" :
                        act.type === "Meeting" ? "bg-purple-50" :
                        act.type === "Follow-up" ? "bg-amber-50" :
                        "bg-gray-50"
                      )}>
                        {act.type === "Call" ? <Phone className="h-2.5 w-2.5 text-green-600" /> :
                         act.type === "Email" ? <Mail className="h-2.5 w-2.5 text-blue-600" /> :
                         act.type === "Meeting" ? <UsersIcon className="h-2.5 w-2.5 text-purple-600" /> :
                         act.type === "Follow-up" ? <TrendingUp className="h-2.5 w-2.5 text-amber-600" /> :
                         <FileText className="h-2.5 w-2.5 text-gray-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{act.subject}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{act.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-400">{formatDate(act.date)}</span>
                          <Badge variant="secondary" className={cn("text-[10px]",
                            act.status === "Completed" ? "bg-emerald-50 text-emerald-700" :
                            act.status === "Scheduled" ? "bg-blue-50 text-blue-700" :
                            "bg-red-50 text-red-700"
                          )}>{act.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
