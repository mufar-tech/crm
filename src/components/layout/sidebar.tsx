"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  ContactRound,
  Building2,
  Target,
  GitBranch,
  CalendarCheck,
  CheckSquare,
  MessageSquare,
  BarChart3,
  UsersRound,
  CreditCard,
  Settings,
  ChevronLeft,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Contacts", href: "/dashboard/contacts", icon: ContactRound },
  { name: "Companies", href: "/dashboard/companies", icon: Building2 },
  { name: "Opportunities", href: "/dashboard/opportunities", icon: Target },
  { name: "Sales Pipeline", href: "/dashboard/pipeline", icon: GitBranch },
  { name: "Activities", href: "/dashboard/activities", icon: CalendarCheck },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Communications", href: "/dashboard/communications", icon: MessageSquare },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Team", href: "/dashboard/team", icon: UsersRound },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn("flex items-center border-b border-gray-100 px-4", collapsed ? "h-16 justify-center" : "h-16")}>
        {collapsed ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-bold text-white">
            M
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-bold text-white">
              M
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">Mufar</h1>
              <p className="-mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-500">CRM</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon size={18} className={cn("shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className={cn("border-t border-gray-100", collapsed ? "px-1 py-3" : "px-3 py-3")}>
        {collapsed ? (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-bold text-white">
              JA
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-bold text-white">
              JA
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">John Anderson</p>
              <p className="truncate text-xs text-slate-500">Sales Manager</p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50",
          collapsed && "rotate-180"
        )}
      >
        <ChevronLeft size={14} className="text-gray-400" />
      </button>
    </aside>
  )
}
