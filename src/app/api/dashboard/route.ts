import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Lead } from "@/lib/models/Lead"
import { Opportunity } from "@/lib/models/Opportunity"
import { Activity } from "@/lib/models/Activity"
import { Task } from "@/lib/models/Task"
import { TeamMember } from "@/lib/models/TeamMember"
import { Billing } from "@/lib/models/Billing"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await connectDB()

  const totalLeads = await Lead.countDocuments()
  const wonLeads = await Lead.countDocuments({ status: "Won" })
  const lostLeads = await Lead.countDocuments({ status: "Lost" })
  const newLeads = await Lead.countDocuments({ status: "New" })

  const totalOpps = await Opportunity.countDocuments()
  const wonOpps = await Opportunity.countDocuments({ stage: "Won" })
  const pipelineOpps = await Opportunity.find({ stage: { $ne: "Won" } })

  const totalPipelineValue = pipelineOpps.reduce((sum, o) => sum + o.dealValue, 0)
  const totalWonValue = (await Opportunity.find({ stage: "Won" })).reduce((sum, o) => sum + o.dealValue, 0)

  const totalMembers = await TeamMember.countDocuments()
  const activeMembers = await TeamMember.countDocuments({ status: "Active" })

  const totalBilling = await Billing.countDocuments()
  const paidBilling = await Billing.countDocuments({ status: "Paid" })
  const pendingBilling = await Billing.countDocuments({ status: "Pending" })
  const totalRevenue = (await Billing.find({ status: "Paid" })).reduce((sum, b) => sum + b.amount, 0)
  const pendingRevenue = (await Billing.find({ status: "Pending" })).reduce((sum, b) => sum + b.amount, 0)

  const recentActivities = await Activity.find().sort({ date: -1 }).limit(5)
  const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(5)

  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

  const revenueByMonth: Record<string, { revenue: number; target: number }> = {}
  const billings = await Billing.find()
  billings.forEach((b) => {
    if (b.date) {
      const month = b.date.slice(0, 7)
      if (!revenueByMonth[month]) revenueByMonth[month] = { revenue: 0, target: 150000 }
      if (b.status === "Paid") revenueByMonth[month].revenue += b.amount
    }
  })

  const revenueData = Object.entries(revenueByMonth).map(([month, data]) => ({
    month,
    revenue: data.revenue,
    target: data.target,
  }))

  const stageCounts: Record<string, number> = {}
  const allOpps = await Opportunity.find()
  allOpps.forEach((o) => {
    stageCounts[o.stage] = (stageCounts[o.stage] || 0) + 1
  })
  const conversionData = Object.entries(stageCounts).map(([stage, count]) => ({
    stage,
    count,
    rate: totalOpps > 0 ? Math.round((count / totalOpps) * 100) : 0,
  }))

  const sourceCounts: Record<string, { count: number; conversion: number }> = {}
  const allLeads = await Lead.find()
  allLeads.forEach((l) => {
    if (!sourceCounts[l.source]) sourceCounts[l.source] = { count: 0, conversion: 0 }
    sourceCounts[l.source].count++
    if (l.status === "Won" || l.status === "Qualified") sourceCounts[l.source].conversion++
  })
  const leadSourceData = Object.entries(sourceCounts).map(([source, data]) => ({
    source,
    count: data.count,
    conversion: data.conversion,
  }))

  const kpis = [
    { label: "Total Leads", value: totalLeads, change: 12, changeType: "increase" as const, icon: "Users" },
    { label: "Active Members", value: activeMembers, change: 8, changeType: "increase" as const, icon: "UserCheck" },
    { label: "Pipeline Value", value: `$${(totalPipelineValue / 1000).toFixed(0)}K`, change: 15, changeType: "increase" as const, icon: "Target" },
    { label: "Companies", value: await (await import("@/lib/models/Company")).Company.countDocuments(), change: 5, changeType: "increase" as const, icon: "Building2" },
    { label: "Revenue", value: `$${(totalRevenue / 1000).toFixed(0)}K`, change: 23, changeType: "increase" as const, icon: "DollarSign" },
    { label: "Won Deals", value: wonOpps, change: 18, changeType: "increase" as const, icon: "TrendingUp" },
    { label: "Conversion Rate", value: `${conversionRate}%`, change: 3, changeType: "increase" as const, icon: "Percent" },
    { label: "Pending Invoices", value: pendingBilling, change: 2, changeType: "decrease" as const, icon: "LineChart" },
  ]

  return NextResponse.json({
    kpis,
    revenueData,
    conversionData,
    leadSourceData,
    recentActivities,
    recentTasks,
    totalRevenue,
    totalLeads,
    conversionRate,
    totalPipelineValue,
    activeMembers,
  })
}
