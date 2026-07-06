"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  UserCheck,
  Target,
  Building2,
  DollarSign,
  TrendingUp,
  Percent,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  ChevronRight,
  Loader2,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { formatDate, getStatusColor } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const kpiIcons = [
  Users,
  UserCheck,
  Target,
  Building2,
  DollarSign,
  TrendingUp,
  Percent,
  LineChart,
]

const PIE_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#9333ea"]

const CustomRechartsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-600">
            {entry.name}: {entry.name === "Revenue" || entry.name === "Target" ? `$${(entry.value / 1000).toFixed(0)}k` : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>({
    kpis: [], revenueData: [], conversionData: [], leadSourceData: [], recentActivities: [], recentTasks: []
  })
  const [loading, setLoading] = useState(true)
  const { fetchWithAuth } = useAuth()

  useEffect(() => {
    fetchWithAuth("/api/dashboard")
      .then((data) => setDashboardData(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>

  const { kpis, revenueData, leadSourceData, conversionData, recentActivities, recentTasks } = dashboardData

  const followUps = recentTasks.filter(
    (t: any) => t.status === "Pending" || t.status === "In Progress"
  )

  const ActivityIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "Call":
        return <Phone className="h-4 w-4 text-blue-600" />
      case "Email":
        return <Mail className="h-4 w-4 text-purple-600" />
      case "Meeting":
        return <Calendar className="h-4 w-4 text-emerald-600" />
      case "Follow-up":
        return <Clock className="h-4 w-4 text-amber-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Executive Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Track your business performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi: any, index: number) => {
          const Icon = kpiIcons[index]
          return (
            <Card key={kpi.label} className="card-hover">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 font-medium">{kpi.label}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                    <Icon className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">{kpi.value}</span>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.changeType === "increase" ? "text-emerald-600" : "text-red-600"}`}>
                    {kpi.changeType === "increase" ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {kpi.change}%
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Monthly Revenue & Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip content={<CustomRechartsTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fill="url(#targetGradient)"
                    strokeDasharray="5 5"
                    name="Target"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="source"
                  >
                    {leadSourceData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomRechartsTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {leadSourceData.map((item: any, index: number) => (
                <div key={item.source} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-gray-600">{item.source}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Conversion Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[200px] sm:h-[250px] md:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="stage" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <RechartsTooltip content={<CustomRechartsTooltip />} />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="flex-1">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pb-4">
              <div className="space-y-3">
                {recentActivities.map((activity: any) => {
                  return (
                    <div key={activity.id || activity._id} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.subject}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(activity.date)}</p>
                      </div>
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
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <CardTitle className="text-base font-semibold">Upcoming Follow-ups</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pb-4">
              {followUps.length > 0 ? (
                <div className="space-y-3">
                  {followUps.slice(0, 5).map((task: any) => (
                    <div key={task.id || task._id} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Due {formatDate(task.dueDate)}
                        </p>
                      </div>
                      <Badge
                        variant={task.priority === "Urgent" ? "destructive" : task.priority === "High" ? "warning" : "secondary"}
                        className="shrink-0 text-[10px]"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming follow-ups</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
