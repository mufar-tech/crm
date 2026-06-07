"use client"

import { useState } from "react"
import {
  User,
  Settings,
  FileSpreadsheet,
  GitBranch,
  Bell,
  Shield,
  Key,
  Puzzle,
  Save,
  Copy,
  CheckCircle2,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  RefreshCw,
  Monitor,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

import { mockIntegrations } from "@/data/mock-data"
import { getInitials, cn } from "@/lib/utils"
import Link from "next/link"

const leadStatuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"]
const stages = ["Lead", "Qualification", "Discovery", "Proposal", "Negotiation", "Won", "Lost"]
const currencies = ["USD - US Dollar", "EUR - Euro", "GBP - British Pound", "JPY - Japanese Yen", "CAD - Canadian Dollar", "AUD - Australian Dollar"]
const timezones = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney"]
const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD Month YYYY"]
const pipelineViews = ["Kanban", "List", "Compact"]
const leadSources = ["Website", "Referral", "LinkedIn", "Mufar Forms", "Email Campaign", "Cold Call", "Social Media"]

const stagesWithDefaults = [
  { name: "Lead", probability: 10 },
  { name: "Qualification", probability: 20 },
  { name: "Discovery", probability: 35 },
  { name: "Proposal", probability: 55 },
  { name: "Negotiation", probability: 75 },
  { name: "Won", probability: 100 },
  { name: "Lost", probability: 0 },
]

const notificationItems = [
  { id: "n1", label: "New lead assigned", description: "When a new lead is assigned to you" },
  { id: "n2", label: "Lead status changed", description: "When a lead you own changes status" },
  { id: "n3", label: "New opportunity", description: "When a new opportunity is created" },
  { id: "n4", label: "Deal won/lost", description: "When a deal is won or lost" },
  { id: "n5", label: "Task assigned", description: "When a task is assigned to you" },
  { id: "n6", label: "Meeting reminder", description: "15 minutes before scheduled meetings" },
  { id: "n7", label: "Daily digest", description: "Daily summary of your activities" },
]

const activeSessions = [
  { id: "s1", device: "Chrome on Windows", ip: "192.168.1.100", lastActive: "Active now", current: true },
  { id: "s2", device: "Safari on iPhone", ip: "192.168.1.101", lastActive: "2 hours ago", current: false },
  { id: "s3", device: "Chrome on macOS", ip: "203.0.113.42", lastActive: "Yesterday", current: false },
]

const apiKeys = [
  { id: "k1", name: "Production API Key", key: "mf_sk_prod_8f3a...2b1c", created: "Jan 15, 2025", active: true },
  { id: "k2", name: "Staging API Key", key: "mf_sk_stag_4d7e...9f2b", created: "Feb 20, 2025", active: true },
  { id: "k3", name: "Development API Key", key: "mf_sk_dev_1a2b...3c4d", created: "Mar 10, 2025", active: false },
]

const integrationCategories = [
  { name: "Mufar Native", color: "bg-blue-500" },
  { name: "Email", color: "bg-purple-500" },
  { name: "Calendar", color: "bg-emerald-500" },
  { name: "Communication", color: "bg-amber-500" },
  { name: "Video Conferencing", color: "bg-cyan-500" },
  { name: "Automation", color: "bg-rose-500" },
  { name: "Developer Tools", color: "bg-gray-500" },
  { name: "CRM", color: "bg-indigo-500" },
]

function ProfileTab() {
  const [name, setName] = useState("Sarah Chen")
  const [email, setEmail] = useState("sarah@mufar.com")
  const [phone, setPhone] = useState("+1 (555) 123-4567")
  const [jobTitle, setJobTitle] = useState("CEO & Founder")
  const [department, setDepartment] = useState("Executive")
  const [bio, setBio] = useState("")
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
          <CardDescription>Update your personal details and public profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <Avatar className="h-20 w-20 ring-2 ring-gray-100">
                <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">Upload a new photo</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <textarea
              className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
              placeholder="Write a short bio about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            {saved && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                <CheckCircle2 className="h-4 w-4" />
                Profile saved successfully
              </div>
            )}
            <div className="flex-1" />
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CRMPreferencesTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Default Settings</CardTitle>
          <CardDescription>Configure your default CRM preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Lead Status</Label>
              <Select defaultValue="New">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leadStatuses.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Opportunity Stage</Label>
              <Select defaultValue="Lead">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select defaultValue="USD - US Dollar">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select defaultValue="America/New_York">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select defaultValue="MM/DD/YYYY">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((df) => (
                    <SelectItem key={df} value={df}>{df}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Pipeline View</Label>
              <Select defaultValue="Kanban">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pipelineViews.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LeadSettingsTab() {
  const [autoAssign, setAutoAssign] = useState(true)
  const [duplicateDetection, setDuplicateDetection] = useState(true)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Lead Configuration</CardTitle>
          <CardDescription>Manage how leads are processed and assigned</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto-assign leads</p>
              <p className="text-sm text-gray-500">Automatically assign new leads to team members</p>
            </div>
            <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Duplicate detection</p>
              <p className="text-sm text-gray-500">Automatically detect and flag duplicate leads</p>
            </div>
            <Switch checked={duplicateDetection} onCheckedChange={setDuplicateDetection} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Lead scoring rules</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
              placeholder="Define rules for lead scoring..."
              defaultValue="Email opened: +10 points&#10;Website visit: +5 points&#10;Demo request: +25 points&#10;Form submission: +15 points"
            />
          </div>
          <div className="space-y-2">
            <Label>Default lead source</Label>
            <Select defaultValue="Website">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {leadSources.map((ls) => (
                  <SelectItem key={ls} value={ls}>{ls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PipelineSettingsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Pipeline Configuration</CardTitle>
          <CardDescription>Customize your sales pipeline stages and defaults</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Pipeline name</Label>
            <Input defaultValue="Sales Pipeline" />
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Default stages order & probability</p>
            <div className="space-y-2">
              {stagesWithDefaults.map((stage, idx) => (
                <div key={stage.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2 text-sm text-gray-400 cursor-grab">
                    <GripVerticalIcon className="h-4 w-4" />
                    <span className="text-xs font-medium text-gray-400 w-5">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{stage.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Probability:</span>
                    <Input
                      className="w-20 h-8 text-sm text-center"
                      defaultValue={stage.probability}
                      type="number"
                      min={0}
                      max={100}
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationsTab() {
  const [notifications, setNotifications] = useState(notificationItems.map((n) => ({ ...n, enabled: true })))

  function toggle(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Email Notifications</CardTitle>
          <CardDescription>Choose which notifications you receive via email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((item) => (
            <div key={item.id}>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <Switch checked={item.enabled} onCheckedChange={() => toggle(item.id)} />
              </div>
              {item.id !== notifications[notifications.length - 1].id && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function SecurityTab() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
              <p className="text-sm text-gray-500">Use authenticator app for additional security</p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input type={showCurrent ? "text" : "password"} placeholder="Enter current password" />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input type={showNew ? "text" : "password"} placeholder="Enter new password" />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <div className="relative">
              <Input type={showConfirm ? "text" : "password"} placeholder="Confirm new password" />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-50 p-2">
                  <Monitor className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{session.device}</p>
                    {session.current && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[10px]">Current</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{session.ip} &middot; {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 gap-1">
                  <LogOut className="h-3.5 w-3.5" />
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function APIKeysTab() {
  const [keys, setKeys] = useState(apiKeys)
  const [notification, setNotification] = useState<string | null>(null)

  function showNotification(msg: string) {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  function toggleKey(id: string) {
    setKeys((prev) => prev.map((k) => k.id === id ? { ...k, active: !k.active } : k))
  }

  function revokeKey(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id))
    showNotification("API key revoked successfully")
  }

  function generateKey() {
    showNotification("New API key generated successfully")
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg">
          <CheckCircle2 className="h-4 w-4" />
          {notification}
        </div>
      )}
      <div className="flex justify-end">
        <Button onClick={generateKey} className="gap-2">
          <Plus className="h-4 w-4" />
          Generate New Key
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{key.name}</p>
                    <Badge variant={key.active ? "success" : "secondary"} className="text-[10px]">
                      {key.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded font-mono">{key.key}</code>
                    <button
                      type="button"
                      onClick={() => { navigator.clipboard.writeText(key.key); showNotification("API key copied to clipboard") }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">Created {key.created}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={key.active} onCheckedChange={() => toggleKey(key.id)} />
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 gap-1" onClick={() => revokeKey(key.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IntegrationsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {integrationCategories.slice(0, 4).map((cat) => {
          const count = mockIntegrations.filter((i) => i.category === cat.name).length
          const connected = mockIntegrations.filter((i) => i.category === cat.name && i.connected).length
          return (
            <Link key={cat.name} href="/dashboard/integrations" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center`}>
                      <Puzzle className="h-4 w-4 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{connected}/{count} active</Badge>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{count} integration{count !== 1 ? "s" : ""}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
      <div className="text-center">
        <Link href="/dashboard/integrations">
          <Button variant="outline" className="gap-2">
            <Puzzle className="h-4 w-4" />
            Manage All Integrations
          </Button>
        </Link>
      </div>
    </div>
  )
}

function Camera(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}

function GripVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  )
}

const tabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "preferences", label: "CRM Preferences", icon: Settings },
  { value: "leads", label: "Lead Settings", icon: FileSpreadsheet },
  { value: "pipeline", label: "Pipeline Settings", icon: GitBranch },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "security", label: "Security", icon: Shield },
  { value: "api-keys", label: "API Keys", icon: Key },
  { value: "integrations", label: "Integrations", icon: Puzzle },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and workspace settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full pb-1">
          <TabsList className="inline-flex h-auto p-1 gap-1 bg-gray-50 border border-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </ScrollArea>

        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="preferences"><CRMPreferencesTab /></TabsContent>
        <TabsContent value="leads"><LeadSettingsTab /></TabsContent>
        <TabsContent value="pipeline"><PipelineSettingsTab /></TabsContent>
        <TabsContent value="notifications"><NotificationsTab /></TabsContent>
        <TabsContent value="security"><SecurityTab /></TabsContent>
        <TabsContent value="api-keys"><APIKeysTab /></TabsContent>
        <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
      </Tabs>
    </div>
  )
}
