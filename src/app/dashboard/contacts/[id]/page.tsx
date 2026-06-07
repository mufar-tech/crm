"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Mail, Phone, Briefcase, Building2, Calendar, Clock, FileText, StickyNote, Users } from "lucide-react"
import { mockContacts, mockActivities } from "@/data/mock-data"
import { getInitials, formatDate, cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const statusColorMap: Record<string, "success" | "secondary"> = {
  Active: "success",
  Inactive: "secondary",
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

export default function ContactDetailPage() {
  const params = useParams()
  const contact = useMemo(
    () => mockContacts.find((c) => c.id === params.id),
    [params.id]
  )

  const activities = useMemo(
    () =>
      mockActivities
        .filter((a) => a.relatedTo === contact?.id || a.relatedTo === contact?.company)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [contact]
  )

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Users className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Contact not found</h3>
        <p className="text-sm text-gray-500 mb-4">The contact you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/contacts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-9 w-9">
          <Link href="/contacts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Contact Profile</h1>
          <p className="text-sm text-gray-500">View and manage contact details</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-10">
            <div className="flex items-end gap-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarFallback className="text-xl">{getInitials(`${contact.firstName} ${contact.lastName}`)}</AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </h2>
                  <Badge variant={statusColorMap[contact.status]}>{contact.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  {contact.jobTitle}
                  <span className="text-gray-300 mx-1">•</span>
                  <Building2 className="h-3.5 w-3.5" />
                  {contact.company}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Email</p>
                <p className="text-gray-900">{contact.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Phone</p>
                <p className="text-gray-900">{contact.phone}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Job Title</p>
                <p className="text-gray-900">{contact.jobTitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              Company Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Company</p>
                <p className="text-gray-900">{contact.company}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Industry</p>
                <p className="text-gray-900">{contact.industry || "—"}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Contact Since</p>
                <p className="text-gray-900">{formatDate(contact.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {contact.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-gray-400" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-0">
                {activities.map((activity, idx) => {
                  const Icon = activityIconMap[activity.type] || FileText
                  return (
                    <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {idx < activities.length - 1 && (
                        <div className="absolute left-[17px] top-8 bottom-0 w-px bg-gray-200" />
                      )}
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No documents attached</p>
              <p className="text-xs text-gray-400 mt-1">Upload contracts, proposals, or files related to this contact.</p>
              <Button variant="outline" size="sm" className="mt-4" disabled>
                Upload Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
