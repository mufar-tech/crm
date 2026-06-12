"use client"

import { useState, useMemo } from "react"
import {
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  Send,
  MoreHorizontal,
  Banknote,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { mockBillingInfo, mockRevenueData } from "@/data/mock-data"
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils"

const statusColorMap: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  Paid: "success",
  Pending: "warning",
  Overdue: "destructive",
  Cancelled: "secondary",
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-600">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const monthlyRevenue = mockRevenueData.map((d) => ({ month: d.month, revenue: d.revenue }))

export default function BillingPage() {
  const [filter, setFilter] = useState<string>("all")

  const filteredInvoices = useMemo(() => {
    if (filter === "all") return mockBillingInfo
    return mockBillingInfo.filter((inv) => inv.status.toLowerCase() === filter.toLowerCase())
  }, [filter])

  const totalRevenue = mockBillingInfo
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const outstanding = mockBillingInfo
    .filter((inv) => inv.status === "Pending" || inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const paidCount = mockBillingInfo.filter((inv) => inv.status === "Paid").length
  const pendingCount = mockBillingInfo.filter((inv) => inv.status === "Pending").length
  const overdueCount = mockBillingInfo.filter((inv) => inv.status === "Overdue").length

  return (
    <div className="space-y-6">
      <div className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Billing</h1>
            <Badge className="bg-blue-100 text-blue-800 border-0 text-[10px]">
              Powered by Mufar Billing
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage invoices, payments, and billing</p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-50/30 p-5 flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="rounded-lg bg-blue-600 p-2.5 shrink-0">
          <Banknote className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">Mufar Billing Integration</h3>
          <p className="text-sm text-gray-600 mt-0.5">
            This billing dashboard is powered by Mufar Billing — your unified invoicing, payment
            tracking, and revenue management solution. Connect your Mufar Billing account for
            real-time sync.
          </p>
        </div>
        <Button variant="default" size="sm" className="shrink-0 bg-blue-600 hover:bg-blue-700">
          <CreditCard className="mr-2 h-4 w-4" />
          Connect Mufar Billing
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-red-50 p-2.5">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              {overdueCount > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  {overdueCount} overdue
                </Badge>
              )}
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{formatCurrency(outstanding)}</p>
            <p className="text-xs text-gray-500 mt-1">Outstanding Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{paidCount}</p>
            <p className="text-xs text-gray-500 mt-1">Paid Invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-50 p-2.5">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{pendingCount}</p>
            <p className="text-xs text-gray-500 mt-1">Pending Invoices</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
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
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#revGrad)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Outstanding Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBillingInfo
                .filter((inv) => inv.status === "Pending" || inv.status === "Overdue")
                .map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{inv.customer}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{inv.invoice}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(inv.amount)}</p>
                      <Badge
                        variant={statusColorMap[inv.status]}
                        className="text-[10px] mt-0.5"
                      >
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              {mockBillingInfo.filter((inv) => inv.status === "Pending" || inv.status === "Overdue").length ===
                0 && (
                <p className="text-sm text-gray-500 text-center py-6">No outstanding payments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <CardTitle className="text-base font-semibold">Invoices</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Invoices</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{inv.invoice}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium">{inv.customer}</TableCell>
                  <TableCell className="text-right text-gray-900 font-medium">
                    {formatCurrency(inv.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColorMap[inv.status]} className="capitalize">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{formatDate(inv.date)}</TableCell>
                  <TableCell className="text-gray-600">{formatDate(inv.dueDate)}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send Reminder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        </CardContent>
      </Card>
    </div>
  )
}
