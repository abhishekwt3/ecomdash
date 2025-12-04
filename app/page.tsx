"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { MainDashboard } from "@/components/main-dashboard"
import { AdsData } from "@/components/ads-data"
import { WebsiteData } from "@/components/website-data"
import { CostCentre } from "@/components/cost-centre"
import { AIInsights } from "@/components/ai-insights"
import { IntegrationsSettings } from "@/components/integrations-settings"
import { Header } from "@/components/header"
export default function DashboardPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeSection === "dashboard" && <MainDashboard />}
          {activeSection === "ads" && <AdsData />}
          {activeSection === "website" && <WebsiteData />}
          {activeSection === "costs" && <CostCentre />}
          {activeSection === "insights" && <AIInsights />}
          {/* NEW ROUTE */}
          {activeSection === "settings" && <IntegrationsSettings />} 
        </main>
      </div>
    </div>
  )
}