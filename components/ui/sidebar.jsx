"use client"

import { useState, createContext, useContext } from "react"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Sidebar Context
const SidebarContext = createContext()

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(true)
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) throw new Error("SidebarProvider is missing")
  return context
}

export const Sidebar = ({ children }) => {
  const { open } = useSidebar()
  return (
    <aside
      className={cn(
        "bg-gray-100 dark:bg-gray-900 min-h-screen transition-all",
        open ? "w-64" : "w-16"
      )}
    >
      {children}
    </aside>
  )
}

export const SidebarHeader = ({ children }) => (
  <div className="p-4 font-bold text-lg">{children}</div>
)

export const SidebarContent = ({ children }) => (
  <div className="px-4">{children}</div>
)

export const SidebarFooter = ({ children }) => (
  <div className="p-4 border-t text-sm text-muted-foreground">{children}</div>
)

export const SidebarMenu = ({ children }) => (
  <nav className="flex flex-col gap-1">{children}</nav>
)

export const SidebarMenuItem = ({ children }) => (
  <div className="px-4 py-2 rounded hover:bg-muted cursor-pointer">{children}</div>
)

export const SidebarTrigger = () => {
  const { open, setOpen } = useSidebar()
  return (
    <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
      <PanelLeft />
    </Button>
  )
}
