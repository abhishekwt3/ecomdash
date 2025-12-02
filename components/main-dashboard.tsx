"use client"

import { useState, useEffect } from "react"
import { MetricCard } from "@/components/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, ShoppingCart, Target, Percent, Megaphone, Receipt } from "lucide-react"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Bar, BarChart, CartesianGrid } from "recharts"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/contexts/AuthContext"

export function MainDashboard() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')

  useEffect(() => {
    if (user?.activeWorkspace?.id) {
      fetchMetrics()
    }
  }, [user, period])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getMetrics(user!.activeWorkspace.id, { period })
      if (response.success) {
        setMetrics(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      await apiClient.refreshMetrics(user!.activeWorkspace.id)
      await fetchMetrics()
    } catch (error) {
      console.error('Failed to refresh metrics:', error)
    }
  }

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading metrics...</p>
        </div>
      </div>
    )
  }

  const { dashboard } = metrics

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Track your key e-commerce metrics and financial performance</p>
        </div>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`$${dashboard.totalRevenue.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          variant="success"
        />
        <MetricCard
          title="Net Profit"
          value={`$${dashboard.netProfit.toLocaleString()}`}
          change={8.2}
          icon={TrendingUp}
          variant="success"
        />
        <MetricCard
          title="Total Orders"
          value={dashboard.totalOrders.toLocaleString()}
          change={15.3}
          icon={ShoppingCart}
        />
        <MetricCard title="ROI" value={`${dashboard.roi.toFixed(1)}%`} change={5.1} icon={Target} variant="info" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Gross Margin"
          value={`${dashboard.grossMargin.toFixed(1)}%`}
          change={2.3}
          icon={Percent}
        />
        <MetricCard
          title="Ad Spend"
          value={`$${dashboard.adSpend.toLocaleString()}`}
          change={-3.2}
          icon={Megaphone}
          variant="warning"
        />
        <MetricCard
          title="Cash Flow"
          value={`$${dashboard.cashFlow.toLocaleString()}`}
          change={18.7}
          icon={Receipt}
          variant="success"
        />
      </div>

      {/* Charts remain the same for now - you can add trend data API later */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Revenue & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Connect to metrics trend API for historical data</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Connect to metrics trend API for historical data</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
