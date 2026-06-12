"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Search, Bell } from "lucide-react"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-3 sm:px-4 lg:left-64">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="lg:hidden shrink-0"
      >
        <Menu size={20} />
      </Button>

      {searchOpen && (
        <div className="fixed inset-0 z-40 flex items-start bg-black/20 p-2 pt-4 sm:hidden" onClick={() => setSearchOpen(false)}>
          <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-900 shadow-lg placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <div className="hidden sm:block relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads, contacts, companies..."
          className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <Button variant="ghost" size="icon" className="sm:hidden shrink-0" onClick={() => setSearchOpen(true)}>
        <Search size={18} />
      </Button>

      <div className="flex items-center gap-1 sm:gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="relative shrink-0">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-bold text-white">
                  JA
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-900">John Anderson</p>
                <p className="text-xs font-normal text-gray-500">john@mufar.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
