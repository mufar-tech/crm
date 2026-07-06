"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft, Globe, Mail, Phone, MapPin, Building2, Users, Target,
  Calendar, DollarSign, Clock, FileText, StickyNote, Briefcase, Loader2
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { formatDate, formatCurrency, getInitials, cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const statusColorMap: Record<string, "success" | "secondary"> = {
  Active: "success",
  Inactive: "secondary",
}

const stageColorMap: Record<string, string> = {
  Lead: "bg-blue-100 text-blue-800",
  Qualification: "bg-purple-100 text-purple-800",
  Discovery: "bg-cyan-100 text-cyan-800",
  Proposal: "bg-indigo-100 text-indigo-800",
  Negotiation: "bg-orange-100 text-orange-800",
  Won: "bg-emerald-100 text-emerald-800",
  Lost: "bg-red-100 text-red-800",
}

const activityIconMap: Record<string, typeof Phone> = {
  Call: Phone,
  Email: Mail,
  Meeting: Briefcase,
  "Follow-up": Clock,
  Note: StickyNote,
  Task: FileText,
}

const activityColorMap: Record<string, string> = {
  Call: "bg-blue-100 text-blue-700",
  Email: "bg-purple-100 text-purple-700",
  Meeting: "bg-amber-100 text-amber-700",
  "Follow-up": "bg-cyan-100 text-cyan-700",
  Note: "bg-gray-100 text-gray-700",
  Task: "bg-emerald-100 text-emerald-700",
}

export default function CompanyDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [company, setCompany] = useState<any>(null)
  const [companyContacts, setCompanyContacts] = useState<any[]>([])
  const [companyOpportunities, setCompanyOpportunities] = useState<any[]>([])
  const [companyActivities, setCompanyActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchWithAuth } = useAuth()

  useEffect(() => {
    Promise.all([
      fetchWithAuth(`/api/companies/${id}`),
      fetchWithAuth("/api/contacts"),
      fetchWithAuth("/api/opportunities"),
      fetchWithAuth("/api/activities"),
    ]).then(([companyData, contactsData, opportunitiesData, activitiesData]) => {
      setCompany(companyData)
      const filteredContacts = contactsData.filter((c: any) => c.company === companyData?.name)
      const filteredOpps = opportunitiesData.filter((o: any) => o.customerId === companyData?.id)
      const filteredActivities = activitiesData
        .filter((a: any) =>
          a.relatedTo === companyData?.id ||
          filteredContacts.some((c: any) => a.relatedTo === c.id) ||
          filteredOpps.some((o: any) => a.relatedTo === o.id)
        )
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setCompanyContacts(filteredContacts)
      setCompanyOpportunities(filteredOpps)
      setCompanyActivities(filteredActivities)
    }).catch(console.error).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Building2 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Company not found</h3>
        <p className="text-sm text-gray-500 mb-4">The company you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/companies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0">
          <Link href="/companies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Company Profile</h1>
          <p className="text-sm text-gray-500">View and manage company details</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600" />
        <CardContent className="relative p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-10">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-white bg-blue-50 text-blue-700 font-bold text-2xl shadow-lg">
                {getInitials(company.name)}
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                  <Badge variant="secondary" className="font-normal">
                    {company.industry}
                  </Badge>
                  <Badge variant={statusColorMap[company.status]}>{company.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Globe className="h-3.5 w-3.5" />
                  {company.website}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="overview" className="shrink-0">Overview</TabsTrigger>
          <TabsTrigger value="contacts" className="shrink-0">Contacts ({companyContacts.length})</TabsTrigger>
          <TabsTrigger value="opportunities" className="shrink-0">Opportunities ({companyOpportunities.length})</TabsTrigger>
          <TabsTrigger value="activity" className="shrink-0">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Website</p>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Phone</p>
                    <p className="text-gray-900">{company.phone}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="text-gray-900">{company.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Revenue</p>
                    <p className="text-gray-900">{company.revenue}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Employees</p>
                    <p className="text-gray-900">{company.employees.toLocaleString()}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Address</p>
                    <p className="text-gray-900">
                      {company.address}, {company.city}, {company.country}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Created</p>
                    <p className="text-gray-900">{formatDate(company.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                Contacts at {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {companyContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No contacts from this company</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Name</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyContacts.map((contact) => (
                      <TableRow key={contact.id || contact._id}>
                        <TableCell className="pl-6">
                          <Link href={`/dashboard/contacts/${contact.id || contact._id}`} className="flex items-center gap-3 hover:underline">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs">{getInitials(`${contact.firstName} ${contact.lastName}`)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-gray-600">{contact.jobTitle}</TableCell>
                        <TableCell className="text-gray-600">{contact.email}</TableCell>
                        <TableCell className="text-gray-600">{contact.phone}</TableCell>
                        <TableCell>
                          <Badge variant={statusColorMap[contact.status] || "secondary"} className="capitalize">
                            {contact.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-400" />
                Opportunities at {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {companyOpportunities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Target className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No opportunities for this company</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Name</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead>Expected Close</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyOpportunities.map((opp) => (
                      <TableRow key={opp.id || opp._id}>
                        <TableCell className="pl-6 font-medium text-gray-900">{opp.name}</TableCell>
                        <TableCell>
                          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", stageColorMap[opp.stage] || "bg-gray-100 text-gray-800")}>
                            {opp.stage}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">
                          {formatCurrency(opp.dealValue)}
                        </TableCell>
                        <TableCell className="text-gray-600">{opp.probability}%</TableCell>
                        <TableCell className="text-gray-600">{formatDate(opp.expectedCloseDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {companyActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No activity recorded for this company</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {companyActivities.map((activity, idx) => {
                    const Icon = activityIconMap[activity.type] || FileText
                    return (
                      <div key={activity.id || activity._id} className="relative flex gap-4 pb-6 last:pb-0">
                        {idx < companyActivities.length - 1 && (
                          <div className="absolute left-[17px] top-8 bottom-0 w-px bg-gray-200" />
                        )}
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          activityColorMap[activity.type] || "bg-gray-100 text-gray-700"
                        )}
                      >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">{activity.subject}</p>
                            <span className="text-xs text-gray-400 shrink-0">{formatDate(activity.date)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {activity.type} • {activity.status}
                          </p>
                          {activity.description && (
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
