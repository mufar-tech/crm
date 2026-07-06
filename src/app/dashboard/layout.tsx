"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const close = () => setIsSidebarOpen(false)
  const toggle = () => setIsSidebarOpen((prev) => !prev)

  return (
    <div className="flex h-screen overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      <div className={`fixed left-0 top-0 z-50 h-full w-72 sm:w-64 lg:static lg:block lg:z-auto ${isSidebarOpen ? "block" : "hidden"} lg:!block`}>
        <Sidebar onClose={close} onNavigate={close} />
      </div>

      <div className="flex flex-1 flex-col min-w-0 lg:pl-0">
        <Header onMenuToggle={toggle} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
