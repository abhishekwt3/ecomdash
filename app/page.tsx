"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MainDashboard } from "@/components/main-dashboard"
import { AdsData } from "@/components/ads-data"
import { WebsiteData } from "@/components/website-data"
import { CostCentre } from "@/components/cost-centre"
import { Header } from "@/components/header"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {activeSection === "dashboard" && <MainDashboard />}
          {activeSection === "ads" && <AdsData />}
          {activeSection === "website" && <WebsiteData />}
          {activeSection === "costs" && <CostCentre />}
        </main>
      </div>
    </div>
  )
}
