"use client"

import { useState, useMemo } from "react"
import {
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  ExternalLink,
  Settings,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const flowSteps = [
  { label: "Mufar Forms Submission", description: "Customer submits a form", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Auto Create Lead", description: "Lead created in CRM", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Lead Qualification", description: "AI-powered qualification", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Sales Pipeline", description: "Assigned to pipeline", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Customer Conversion", description: "Win the deal", icon: Zap, color: "text-rose-600", bg: "bg-rose-50" },
]

const statsCards = [
  { label: "Total Form Submissions", value: "3,847", change: "+12.5%", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Leads Created", value: "2,891", change: "+18.3%", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Conversion Rate", value: "31.4%", change: "+5.2%", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
]

const formsData = [
  { form: "Contact Us", source: "Website", submissions: 1250, leadsCreated: 892, conversionRate: 71.4, status: "Active" as const },
  { form: "Demo Request", source: "Website", submissions: 845, leadsCreated: 678, conversionRate: 80.2, status: "Active" as const },
  { form: "Newsletter Signup", source: "Blog", submissions: 2100, leadsCreated: 420, conversionRate: 20.0, status: "Active" as const },
  { form: "Enterprise Trial", source: "Landing Page", submissions: 320, leadsCreated: 295, conversionRate: 92.2, status: "Active" as const },
  { form: "Partner Application", source: "Partner Portal", submissions: 145, leadsCreated: 112, conversionRate: 77.2, status: "Active" as const },
  { form: "Event Registration", source: "Events", submissions: 520, leadsCreated: 380, conversionRate: 73.1, status: "Paused" as const },
  { form: "Support Ticket", source: "Help Center", submissions: 890, leadsCreated: 114, conversionRate: 12.8, status: "Active" as const },
]

export default function FormsIntegrationPage() {
  const [search, setSearch] = useState("")

  const filteredForms = useMemo(() => {
    if (!search) return formsData
    const q = search.toLowerCase()
    return formsData.filter(
      (f) => f.form.toLowerCase().includes(q) || f.source.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mufar Forms Integration</h1>
            <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Seamlessly connect Mufar Forms with your CRM pipeline</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4 shrink-0" />
            Configure Integration
          </Button>
          <Button variant="premium" className="gap-2">
            <ExternalLink className="h-4 w-4 shrink-0" />
            View Mufar Forms
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-rose-50 border-0">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4">
            {flowSteps.map((step, idx) => (
              <div key={step.label} className="flex items-center gap-3 flex-1 min-w-[160px]">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", step.bg)}>
                    <step.icon className={cn("h-5 w-5", step.color)} />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-gray-900">{step.label}</p>
                    <p className="text-[10px] text-gray-500">{step.description}</p>
                  </div>
                </div>
                {idx < flowSteps.length - 1 && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="hidden lg:flex items-center">
                      <div className="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-gray-200" />
                      <ArrowRight className="h-4 w-4 text-gray-300 -ml-1" />
                    </div>
                    <div className="lg:hidden">
                      <ArrowRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{stat.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <CardTitle className="text-base font-semibold">Form Submissions Overview</CardTitle>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search forms..."
                className="pl-9 w-full sm:w-64 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Lead Source</TableHead>
                <TableHead className="text-right">Submissions</TableHead>
                <TableHead className="text-right">Leads Created</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.form}>
                  <TableCell>
                    <span className="font-medium text-gray-900">{form.form}</span>
                  </TableCell>
                  <TableCell className="text-gray-600">{form.source}</TableCell>
                  <TableCell className="text-right font-medium text-gray-900">{form.submissions.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium text-gray-900">{form.leadsCreated.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress value={form.conversionRate} className="h-2 w-24" />
                      <span className="text-sm font-medium text-gray-700 w-12">{form.conversionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={form.status === "Active" ? "success" : "secondary"} className={cn(
                      "text-[10px]",
                      form.status === "Active" ? "bg-emerald-50 text-emerald-700" : ""
                    )}>
                      {form.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
