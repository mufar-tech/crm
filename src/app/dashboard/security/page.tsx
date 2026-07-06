"use client"

import {
  Shield,
  CheckCircle2,
  FileText,
  Users,
  Lock,
  RefreshCw,
  Eye,
  Server,
  Database,
  Activity,
  Clock,
  UserCheck,
  Fingerprint,
  FileSearch,
  Award,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const securityCards = [
  {
    title: "HTTPS Encryption",
    description: "All data in transit is encrypted using TLS 1.3 protocol with 256-bit AES encryption.",
    icon: Lock,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    status: "Active",
    features: ["TLS 1.3", "256-bit AES", "HSTS Enabled", "Perfect Forward Secrecy"],
  },
  {
    title: "Audit Logs",
    description: "Comprehensive audit trail of all system activities and data access events.",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
    status: "Active",
    recentActivity: [
      { action: "User login from new device", time: "2 minutes ago" },
      { action: "Export of customer data", time: "1 hour ago" },
      { action: "Role permission changed", time: "3 hours ago" },
      { action: "API key generated", time: "1 day ago" },
    ],
  },
  {
    title: "Role Based Access Control",
    description: "Granular permission controls with role-based access management.",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
    status: "Active",
    roles: [
      { name: "Owner", count: 1, color: "bg-purple-500" },
      { name: "Admin", count: 3, color: "bg-blue-500" },
      { name: "Sales Manager", count: 5, color: "bg-emerald-500" },
      { name: "Sales Rep", count: 12, color: "bg-amber-500" },
      { name: "Support", count: 4, color: "bg-cyan-500" },
      { name: "Viewer", count: 8, color: "bg-gray-500" },
    ],
  },
  {
    title: "Data Protection",
    description: "Data encrypted at rest using AES-256 with automatic key rotation every 90 days.",
    icon: Database,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    status: "Active",
    details: ["AES-256 Encryption", "Auto Key Rotation", "Data at Rest", "Secure Backup"],
  },
  {
    title: "Backup & Recovery",
    description: "Automated daily backups with point-in-time recovery and 99.99% durability.",
    icon: RefreshCw,
    color: "text-amber-600",
    bg: "bg-amber-50",
    status: "Active",
    lastBackup: "Today at 3:00 AM",
    details: ["Daily Automated Backups", "30-day Retention", "Point-in-time Recovery", "Geo-redundant Storage"],
  },
  {
    title: "Privacy Controls",
    description: "GDPR, CCPA, and HIPAA compliant data handling with privacy-by-design architecture.",
    icon: Eye,
    color: "text-rose-600",
    bg: "bg-rose-50",
    status: "Active",
    details: ["GDPR Compliant", "CCPA Compliant", "Data Retention Controls", "Privacy Dashboard"],
  },
]

const securityFeatures = [
  { icon: Fingerprint, title: "SSO & SAML", description: "Single sign-on with SAML 2.0, OAuth 2.0, and OpenID Connect support." },
  { icon: UserCheck, title: "Multi-factor Authentication", description: "TOTP, SMS, and hardware key support for 2FA." },
  { icon: FileSearch, title: "Data Loss Prevention", description: "Automated DLP policies to prevent data exfiltration." },
  { icon: Shield, title: "Penetration Testing", description: "Regular third-party penetration testing and vulnerability assessments." },
  { icon: Activity, title: "Threat Detection", description: "Real-time threat detection with AI-powered anomaly monitoring." },
  { icon: Server, title: "Infrastructure Security", description: "SOC 2 Type II certified infrastructure with 24/7 monitoring." },
]

const complianceBadges = [
  { name: "SOC 2 Type II", description: "Security, availability, and confidentiality controls", icon: Shield },
  { name: "GDPR", description: "General Data Protection Regulation compliant", icon: Award },
  { name: "HIPAA", description: "Health Insurance Portability and Accountability Act", icon: Award },
  { name: "ISO 27001", description: "Information security management system certified", icon: Award },
]

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Security</h1>
            <Badge variant="premium" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              Enterprise Grade
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Enterprise-grade security protecting your data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {securityCards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.bg)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-0.5" />
                  {card.status}
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold text-gray-900 mt-3">{card.title}</CardTitle>
              <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
            </CardHeader>
            <CardContent>
              {"features" in card && card.features && (
                <div className="flex flex-wrap gap-1.5">
                  {card.features.map((f) => (
                    <span key={f} className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 border border-gray-100">
                      {f}
                    </span>
                  ))}
                </div>
              )}
              {"recentActivity" in card && card.recentActivity && (
                <div className="space-y-2">
                  {card.recentActivity.map((act, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{act.action}</span>
                      <span className="text-gray-400">{act.time}</span>
                    </div>
                  ))}
                </div>
              )}
              {"roles" in card && card.roles && (
                <div className="space-y-2">
                  {card.roles.map((role) => (
                    <div key={role.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", role.color)} />
                        <span className="text-gray-600">{role.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{role.count}</span>
                    </div>
                  ))}
                </div>
              )}
              {"details" in card && card.details && (
                <div className="flex flex-wrap gap-1.5">
                  {card.details.map((d) => (
                    <span key={d} className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 border border-gray-100">
                      {d}
                    </span>
                  ))}
                </div>
              )}
              {"lastBackup" in card && card.lastBackup && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <Clock className="h-3 w-3" />
                  Last backup: {card.lastBackup}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Security Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <feature.icon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Compliance & Certifications</CardTitle>
              <p className="text-sm text-gray-500 mt-1">We maintain the highest security standards and compliance certifications</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {complianceBadges.map((badge) => (
              <div key={badge.name} className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mb-3">
                  <badge.icon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="text-white">
              <h3 className="text-lg font-semibold">Enterprise Trust & Security</h3>
              <p className="text-sm text-blue-100 mt-1 max-w-xl">
                Mufar CRM is trusted by enterprises worldwide. Our infrastructure is built on AWS with multiple layers of security, 
                encryption, and compliance certifications. We offer enterprise-grade SLAs, dedicated support, and custom security 
                reviews for our enterprise customers.
              </p>
            </div>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0 gap-2 shrink-0">
              Contact Sales
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
