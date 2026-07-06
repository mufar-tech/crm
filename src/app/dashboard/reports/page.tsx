"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  TrendingUp,
  Users,
  DollarSign,
  Percent,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChartIcon,
  BarChart3,
  Activity,
  Target,
  Layers,
  UserCheck,
  MousePointerClick,
  CreditCard,
  Loader2,
  FileSpreadsheet,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { exportData, type ExportFormat } from "@/lib/export-data"
import * as XLSX from "xlsx"

const PIE_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#9333ea"]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-600">
            {entry.name}: {typeof entry.value === "number" && entry.name !== "Rate"
              ? entry.name === "Revenue" || entry.name === "Target" || entry.name === "value"
                ? formatCurrency(entry.value)
                : formatNumber(entry.value)
              : `${entry.value}${entry.name === "Rate" ? "%" : ""}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const dateRanges = ["This Month", "This Quarter", "This Year"]

const roleColors: Record<string, string> = {
  Owner: "bg-purple-100 text-purple-800",
  Admin: "bg-blue-100 text-blue-800",
  "Sales Manager": "bg-emerald-100 text-emerald-800",
  "Sales Representative": "bg-amber-100 text-amber-800",
  "Support Agent": "bg-cyan-100 text-cyan-800",
  Viewer: "bg-gray-100 text-gray-800",
}

export default function ReportsPage() {
  const [activeDateRange, setActiveDateRange] = useState("This Year")
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [leadSourceData, setLeadSourceData] = useState<any[]>([])
  const [conversionData, setConversionData] = useState<any[]>([])
  const [kpis, setKpis] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchWithAuth } = useAuth()

  useEffect(() => {
    Promise.all([
      fetchWithAuth("/api/dashboard"),
      fetchWithAuth("/api/leads"),
      fetchWithAuth("/api/opportunities"),
      fetchWithAuth("/api/team"),
    ]).then(([dashboard, leadsData, oppsData, teamData]) => {
      setRevenueData(dashboard.revenueData || [])
      setLeadSourceData(dashboard.leadSourceData || [])
      setConversionData(dashboard.conversionData || [])
      setKpis(dashboard.kpis || [])
      setLeads(leadsData)
      setOpportunities(oppsData)
      setTeamMembers(teamData)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>

  const totalLeads = leads.length
  const wonLeads = leads.filter((l: any) => l.status === "Won").length
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0"
  const totalRevenue = revenueData.reduce((sum: number, d: any) => sum + d.revenue, 0)
  const totalOpportunities = opportunities.length
  const activeDeals = opportunities.filter((o: any) => o.stage !== "Won" && o.stage !== "Lost").length

  const sourceWithPercent = leadSourceData.map((s: any) => ({
    ...s,
    percent: ((s.count / leadSourceData.reduce((a: number, b: any) => a + b.count, 0)) * 100).toFixed(1),
  }))

  const pipelineByStage: Record<string, { stage: string; value: number; count: number }> = opportunities.reduce(
    (acc: any, opp: any) => {
      const stage = opp.stage
      if (!acc[stage]) acc[stage] = { stage, value: 0, count: 0 }
      acc[stage].value += opp.dealValue
      acc[stage].count += 1
      return acc
    },
    {}
  )
  const pipelineData = Object.values(pipelineByStage)

  const forecastData = revenueData.map((d: any) => ({
    month: d.month,
    actual: d.revenue,
    forecast: d.target,
  }))

  const teamPerformance = teamMembers.map((m: any) => ({
    name: m.name,
    leads: m.leads,
    deals: m.deals,
    revenue: m.revenue,
    conversion: m.leads > 0 ? ((m.deals / m.leads) * 100).toFixed(1) : "0.0",
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive business intelligence and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
            {dateRanges.map((range) => (
              <button
                key={range}
                onClick={() => setActiveDateRange(range)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeDateRange === range
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => {
                const reports = [
                  { data: revenueData, cols: [
                    { header: "Month", accessor: (r: any) => r.month },
                    { header: "Revenue", accessor: (r: any) => r.revenue },
                    { header: "Target", accessor: (r: any) => r.target },
                  ], name: "revenue" },
                  { data: sourceWithPercent, cols: [
                    { header: "Source", accessor: (r: any) => r.source },
                    { header: "Leads", accessor: (r: any) => r.count },
                    { header: "% of Total", accessor: (r: any) => r.percent },
                    { header: "Conversion Rate", accessor: (r: any) => r.conversion },
                  ], name: "lead-sources" },
                  { data: conversionData, cols: [
                    { header: "Stage", accessor: (r: any) => r.stage },
                    { header: "Count", accessor: (r: any) => r.count },
                    { header: "Rate (%)", accessor: (r: any) => r.rate },
                  ], name: "conversion-funnel" },
                  { data: teamPerformance, cols: [
                    { header: "Team Member", accessor: (r: any) => r.name },
                    { header: "Leads", accessor: (r: any) => r.leads },
                    { header: "Deals", accessor: (r: any) => r.deals },
                    { header: "Revenue", accessor: (r: any) => r.revenue },
                    { header: "Conversion (%)", accessor: (r: any) => r.conversion },
                  ], name: "team-performance" },
                  { data: pipelineData, cols: [
                    { header: "Stage", accessor: (r: any) => r.stage },
                    { header: "Deals", accessor: (r: any) => r.count },
                    { header: "Total Value", accessor: (r: any) => r.value },
                  ], name: "pipeline-summary" },
                ]
                reports.forEach((r) => exportData(r.data, r.cols, "csv", r.name, `${r.name}.csv`))
              }}>
                <FileText className="mr-2 h-4 w-4" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const reports = [
                  { data: revenueData, cols: [
                    { header: "Month", accessor: (r: any) => r.month },
                    { header: "Revenue", accessor: (r: any) => r.revenue },
                    { header: "Target", accessor: (r: any) => r.target },
                  ], sheet: "Revenue" },
                  { data: sourceWithPercent, cols: [
                    { header: "Source", accessor: (r: any) => r.source },
                    { header: "Leads", accessor: (r: any) => r.count },
                    { header: "% of Total", accessor: (r: any) => r.percent },
                    { header: "Conversion Rate", accessor: (r: any) => r.conversion },
                  ], sheet: "Lead Sources" },
                  { data: conversionData, cols: [
                    { header: "Stage", accessor: (r: any) => r.stage },
                    { header: "Count", accessor: (r: any) => r.count },
                    { header: "Rate (%)", accessor: (r: any) => r.rate },
                  ], sheet: "Conversion" },
                  { data: teamPerformance, cols: [
                    { header: "Team Member", accessor: (r: any) => r.name },
                    { header: "Leads", accessor: (r: any) => r.leads },
                    { header: "Deals", accessor: (r: any) => r.deals },
                    { header: "Revenue", accessor: (r: any) => r.revenue },
                    { header: "Conversion (%)", accessor: (r: any) => r.conversion },
                  ], sheet: "Performance" },
                  { data: pipelineData, cols: [
                    { header: "Stage", accessor: (r: any) => r.stage },
                    { header: "Deals", accessor: (r: any) => r.count },
                    { header: "Total Value", accessor: (r: any) => r.value },
                  ], sheet: "Pipeline" },
                ]
                const wb = XLSX.utils.book_new()
                reports.forEach((r) => {
                  const wsData = [r.cols.map((c: any) => c.header)]
                  r.data.forEach((row: any) => wsData.push(r.cols.map((c: any) => c.accessor(row))))
                  const ws = XLSX.utils.aoa_to_sheet(wsData)
                  XLSX.utils.book_append_sheet(wb, ws, r.sheet)
                })
                XLSX.writeFile(wb, "reports.xlsx")
              }}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const reports = [
                  { data: revenueData, cols: [
                    { header: "Month", accessor: (r: any) => r.month },
                    { header: "Revenue", accessor: (r: any) => r.revenue },
                    { header: "Target", accessor: (r: any) => r.target },
                  ], title: "Revenue Data" },
                  { data: sourceWithPercent, cols: [
                    { header: "Source", accessor: (r: any) => r.source },
                    { header: "Leads", accessor: (r: any) => r.count },
                    { header: "% of Total", accessor: (r: any) => r.percent },
                    { header: "Conversion Rate", accessor: (r: any) => r.conversion },
                  ], title: "Lead Sources" },
                  { data: conversionData, cols: [
                    { header: "Stage", accessor: (r: any) => r.stage },
                    { header: "Count", accessor: (r: any) => r.count },
                    { header: "Rate (%)", accessor: (r: any) => r.rate },
                  ], title: "Conversion Funnel" },
                  { data: teamPerformance, cols: [
                    { header: "Team Member", accessor: (r: any) => r.name },
                    { header: "Leads", accessor: (r: any) => r.leads },
                    { header: "Deals", accessor: (r: any) => r.deals },
                    { header: "Revenue", accessor: (r: any) => r.revenue },
                    { header: "Conversion (%)", accessor: (r: any) => r.conversion },
                  ], title: "Team Performance" },
                  { data: pipelineData, cols: [
                    { header: "Stage", accessor: (r: any) => r.stage },
                    { header: "Deals", accessor: (r: any) => r.count },
                    { header: "Total Value", accessor: (r: any) => r.value },
                  ], title: "Pipeline Summary" },
                ]
                reports.forEach((r) => exportData(r.data, r.cols, "pdf", r.title, `${r.title.replace(/\s+/g, "-").toLowerCase()}.pdf`))
              }}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="success" className="text-[10px]">
                +18.7%
              </Badge>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <Badge variant="success" className="text-[10px]">
                +12.5%
              </Badge>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{formatNumber(totalLeads)}</p>
            <p className="text-xs text-gray-500 mt-1">Total Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-50 p-2.5">
                <Percent className="h-5 w-5 text-purple-600" />
              </div>
              <Badge variant="success" className="text-[10px]">
                +2.1%
              </Badge>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{conversionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Conversion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-50 p-2.5">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <Badge variant="success" className="text-[10px]">
                +14.3%
              </Badge>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{formatNumber(activeDeals)}</p>
            <p className="text-xs text-gray-500 mt-1">Active Deals</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lead-sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Revenue vs Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ fill: "#2563eb", r: 3 }}
                        name="Revenue"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "#7c3aed", r: 3 }}
                        name="Target"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-emerald-600" />
                  Lead Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadSourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="count"
                        nameKey="source"
                      >
                        {leadSourceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-1.5">
                  {sourceWithPercent.slice(0, 5).map((item, index) => (
                    <div key={item.source} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                        <span className="text-gray-600">{item.source}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} width={80} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={18} name="Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Key Metrics Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {kpis.slice(0, 6).map((kpi) => (
                    <div key={kpi.label} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                      <div>
                        <p className="text-xs text-gray-500">{kpi.label}</p>
                        <p className="text-lg font-semibold text-gray-900 mt-0.5">{kpi.value}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${
                        kpi.changeType === "increase" ? "text-emerald-600" : "text-red-600"
                      }`}>
                        {kpi.changeType === "increase" ? (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5" />
                        )}
                        {kpi.change}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lead-sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Lead Source Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadSourceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="count"
                        nameKey="source"
                        label={({ name, percent }: any) => `${name || ""} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        labelLine={true}
                      >
                        {leadSourceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Source Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leadSourceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} unit="%" />
                      <YAxis dataKey="source" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} width={100} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="conversion" fill="#059669" radius={[0, 4, 4, 0]} barSize={18} name="Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Lead Source Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Source</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Leads</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">% of Total</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Conversion Rate</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceWithPercent.map((item, index) => {
                    const maxCount = Math.max(...leadSourceData.map((s) => s.count))
                    return (
                      <tr key={item.source} className="border-b border-gray-50 last:border-0">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                            <span className="text-sm font-medium text-gray-900">{item.source}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-900 font-medium">{formatNumber(item.count)}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-600">{item.percent}%</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-900 font-medium">{item.conversion}%</td>
                        <td className="px-6 py-3.5">
                          <div className="flex justify-end">
                            <div className="w-32 bg-gray-100 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${(item.count / maxCount) * 100}%`,
                                  backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                  Stage-by-Stage Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="stage" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={36} name="Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-rose-600" />
                  Drop-off Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={conversionData}>
                      <defs>
                        <linearGradient id="dropoffGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="stage" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="%" />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="rate" stroke="#e11d48" strokeWidth={2.5} fill="url(#dropoffGradient)" name="Rate" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Detailed Stage Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionData.map((item, index) => {
                  const prevCount = index > 0 ? conversionData[index - 1].count : item.count
                  const dropoff = index > 0 ? ((prevCount - item.count) / prevCount * 100).toFixed(1) : "0.0"
                  return (
                    <div key={item.stage}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{item.stage}</span>
                          <span className="text-xs text-gray-500">({formatNumber(item.count)})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{item.rate}% of total</span>
                          {index > 0 && (
                            <Badge variant="destructive" className="text-[10px]">
                              -{dropoff}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={item.rate} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
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
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revenueGradient)" name="Revenue" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Revenue by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadSourceData.map((s) => ({ ...s, value: s.count * 500 }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="source"
                      >
                        {leadSourceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value: string) => (
                          <span className="text-xs text-gray-600">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Month</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Revenue</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Target</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Achievement</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((item) => {
                    const achievement = ((item.revenue / item.target) * 100).toFixed(1)
                    const variance = item.revenue - item.target
                    const isAbove = variance >= 0
                    return (
                      <tr key={item.month} className="border-b border-gray-50 last:border-0">
                        <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{item.month}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-900 font-medium">{formatCurrency(item.revenue)}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-600">{formatCurrency(item.target)}</td>
                        <td className="px-6 py-3.5 text-right">
                          <span className={`text-sm font-medium ${isAbove ? "text-emerald-600" : "text-red-600"}`}>
                            {achievement}%
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Badge variant={isAbove ? "success" : "destructive"} className="text-[10px]">
                            {isAbove ? "+" : ""}{formatCurrency(variance)}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-600" />
                Team Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Team Member</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Leads</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Deals</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Revenue</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Conversion</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Perf.</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformance.map((member) => {
                    const maxRevenue = Math.max(...teamPerformance.map((m) => m.revenue))
                    const perfWidth = (member.revenue / maxRevenue) * 100
                    return (
                      <tr key={member.name} className="border-b border-gray-50 last:border-0">
                        <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-900">{formatNumber(member.leads)}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-900">{formatNumber(member.deals)}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-900 font-medium">{formatCurrency(member.revenue)}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-900">{member.conversion}%</td>
                        <td className="px-6 py-3.5">
                          <div className="flex justify-end">
                            <div className="w-24 bg-gray-100 rounded-full h-2">
                              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${perfWidth}%` }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Deals by Team Member</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} width={100} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="deals" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={16} name="Deals" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Revenue by Team Member</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis
                        type="number"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} width={100} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" fill="#059669" radius={[0, 4, 4, 0]} barSize={16} name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  Pipeline Value by Stage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="stage" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={36} name="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-amber-600" />
                  Forecast vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ fill: "#2563eb", r: 3 }}
                        name="Actual"
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#d97706"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "#d97706", r: 3 }}
                        name="Forecast"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Pipeline Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Stage</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Deals</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Total Value</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Avg. Deal Size</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">% of Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineData.map((item) => {
                    const totalPipeValue = pipelineData.reduce((s: number, p: any) => s + p.value, 0)
                    const pct = ((item.value / totalPipeValue) * 100).toFixed(1)
                    const avgDeal = item.count > 0 ? item.value / item.count : 0
                    return (
                      <tr key={item.stage} className="border-b border-gray-50 last:border-0">
                        <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{item.stage}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-900">{item.count}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-900 font-medium">{formatCurrency(item.value)}</td>
                        <td className="px-6 py-3.5 text-right text-sm text-gray-600">{formatCurrency(avgDeal)}</td>
                        <td className="px-6 py-3.5 text-right">
                          <span className="text-sm font-medium text-gray-900">{pct}%</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
