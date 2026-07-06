"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Users, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockLeads, mockOpportunities, mockActivities } from "@/data/mock-data"
import { formatCurrency, formatDate, cn } from "@/lib/utils"

export default function CustomersPage() {
  const [search, setSearch] = useState("")

  const customers = useMemo(() => {
    const wonLeads = mockLeads.filter((l) => l.status === "Won")
    return wonLeads.map((lead) => {
      const opps = mockOpportunities.filter(
        (o) => o.customer === lead.company && o.stage === "Won"
      )
      const totalDeals = opps.length
      const totalRevenue = opps.reduce((sum, o) => sum + o.dealValue, 0)
      const lastActivity = mockActivities
        .filter((a) => a.relatedTo === lead.id || opps.some((o) => o.id === a.relatedTo))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        totalDeals,
        totalRevenue,
        lastActivity: lastActivity?.date || lead.updatedAt,
        status: lead.status,
      }
    }).sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
  }, [])

  const filtered = useMemo(() => {
    if (!search) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
    )
  }, [customers, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">{customers.length} total customers</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search customers by name, email or company..."
                  className="pl-9 w-full sm:max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
              <p className="text-sm text-gray-500 mt-1">
                {search ? "Try adjusting your search terms." : "No won leads have been converted to customers yet."}
              </p>
            </div>
          ) : (
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Total Deals</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((customer) => (
                  <TableRow key={customer.id} className="group">
                    <TableCell>
                      <span className="font-medium text-gray-900">{customer.name}</span>
                    </TableCell>
                    <TableCell className="text-gray-600">{customer.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-600">{customer.company}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900">{customer.totalDeals}</TableCell>
                    <TableCell className="text-right font-medium text-gray-900">{formatCurrency(customer.totalRevenue)}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{formatDate(customer.lastActivity)}</TableCell>
                    <TableCell>
                      <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/customers/${customer.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Profile
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
