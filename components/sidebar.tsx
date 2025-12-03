"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Megaphone,
  Globe,
  Wallet,
  Settings,
  ChevronRight,
  TrendingUp,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  X,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ads", label: "Ads Data", icon: Megaphone },
  { id: "website", label: "Website Data", icon: Globe },
  { id: "costs", label: "Cost Centre", icon: Wallet },
  { id: "insights", label: "AI Insights", icon: Sparkles },
]

export function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const handleNavClick = (section: string) => {
    onSectionChange(section)
    onMobileClose?.()
  }

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />}

      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
          "fixed lg:relative inset-y-0 left-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-[72px] w-64" : "w-64",
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className={cn("flex items-center", collapsed ? "lg:justify-center" : "gap-3 px-2")}>
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className={cn("overflow-hidden", collapsed && "lg:hidden")}>
              <h1 className="font-semibold text-sidebar-foreground whitespace-nowrap">MetricsFlow</h1>
              <p className="text-xs text-muted-foreground whitespace-nowrap">E-commerce Analytics</p>
            </div>
            <button onClick={onMobileClose} className="lg:hidden ml-auto p-1 rounded-md hover:bg-sidebar-accent">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center rounded-lg text-sm font-medium transition-colors",
                    collapsed ? "lg:justify-center lg:p-2.5 gap-3 px-3 py-2.5" : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className={cn("flex-1 text-left whitespace-nowrap", collapsed && "lg:hidden")}>
                    {item.label}
                  </span>
                  {isActive && <ChevronRight className={cn("w-4 h-4", collapsed && "lg:hidden")} />}
                </button>
              )
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <button
            title={collapsed ? "Settings" : undefined}
            className={cn(
              "w-full flex items-center rounded-lg text-sm font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
              collapsed ? "lg:justify-center lg:p-2.5 gap-3 px-3 py-2.5" : "gap-3 px-3 py-2.5",
            )}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className={cn(collapsed && "lg:hidden")}>Settings</span>
          </button>

          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden lg:flex w-full items-center rounded-lg text-sm font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
            )}
          >
            {collapsed ? (
              <PanelLeft className="w-5 h-5 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="w-5 h-5 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
