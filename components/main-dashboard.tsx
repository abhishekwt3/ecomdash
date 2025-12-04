"use client"

import { useEffect, useState } from "react"
import { MetricCard } from "@/components/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, ShoppingCart, Target, Percent, Megaphone, Receipt, Loader2 } from "lucide-react"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Bar, BarChart, CartesianGrid } from "recharts"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/contexts/AuthContext"

const cashFlowData = [
  { month: "Jan", inflow: 52000, outflow: 38000 },
  { month: "Feb", inflow: 58000, outflow: 42000 },
  { month: "Mar", inflow: 54000, outflow: 40000 },
  { month: "Apr", inflow: 68000, outflow: 45000 },
  { month: "May", inflow: 62000, outflow: 44000 },
  { month: "Jun", inflow: 75000, outflow: 50000 },
]

export function MainDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guard: Do not fetch if auth is still loading or if user is not logged in
    if (authLoading || !user) {
      return;
    }

    async function fetchData() {
      try {
        const metrics = await apiClient.getMainMetrics(user?.activeWorkspace?._id);
        setData(metrics);
      } catch (e) {
        console.error("Failed to fetch dashboard metrics:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  if (!data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-muted-foreground gap-2">
        <p>Unable to load dashboard data.</p>
        <p className="text-sm">Please ensure you are connected to the backend.</p>
      </div>
    );
  }

  // Transform backend history arrays into Recharts format safely
  const chartData = data.revenue?.history?.map((rev: number, i: number) => ({
    date: `Day ${i+1}`,
    revenue: rev,
    profit: data.profit?.history?.[i] || 0
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">Track your key e-commerce metrics and financial performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value={`$${(data.revenue?.value || 0).toLocaleString()}`} change={data.revenue?.change} icon={DollarSign} variant="success" />
        <MetricCard title="Net Profit" value={`$${(data.profit?.value || 0).toLocaleString()}`} change={data.profit?.change} icon={TrendingUp} variant="success" />
        <MetricCard title="Total Orders" value={(data.orders?.value || 0).toLocaleString()} change={data.orders?.change} icon={ShoppingCart} />
        <MetricCard title="ROI" value={`${data.roi?.value || 0}%`} change={data.roi?.change} icon={Target} variant="info" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Conversion Rate" value={`${data.conversionRate?.value || 0}%`} change={data.conversionRate?.change} icon={Percent} />
        <MetricCard title="AOV" value={`$${data.aov?.value || 0}`} change={data.aov?.change} icon={Receipt} variant="success" />
        <MetricCard title="Gross Margin" value="67.5%" change={2.3} icon={Percent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Revenue & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} labelStyle={{ color: "#f3f4f6" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#revenueGradient)" name="Revenue" />
                  <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#profitGradient)" name="Profit" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <span className="text-sm text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                <span className="text-sm text-muted-foreground">Profit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
                  />
                  <Bar dataKey="inflow" fill="#22c55e" radius={[4, 4, 0, 0]} name="Inflow" />
                  <Bar dataKey="outflow" fill="#ef4444" radius={[4, 4, 0, 0]} name="Outflow" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <span className="text-sm text-muted-foreground">Inflow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <span className="text-sm text-muted-foreground">Outflow</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}