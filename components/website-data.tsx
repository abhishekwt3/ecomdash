"use client"

import { MetricCard } from "@/components/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ShoppingCart,
  Percent,
  RefreshCw,
  AlertTriangle,
  MousePointerClick,
  UserCheck,
  UserPlus,
  Eye,
} from "lucide-react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const conversionData = [
  { date: "Mon", cvr: 2.8, atc: 8.2 },
  { date: "Tue", cvr: 3.1, atc: 9.0 },
  { date: "Wed", cvr: 2.9, atc: 8.5 },
  { date: "Thu", cvr: 3.4, atc: 9.8 },
  { date: "Fri", cvr: 3.2, atc: 9.2 },
  { date: "Sat", cvr: 3.8, atc: 10.5 },
  { date: "Sun", cvr: 3.5, atc: 10.0 },
]

const customerTypeData = [
  { name: "Returning", value: 42, color: "#22c55e" },
  { name: "New", value: 58, color: "#3b82f6" },
]

const trafficSourceData = [
  { name: "Returning via Ads", value: 28, color: "#22c55e" },
  { name: "Unique from Ads", value: 72, color: "#f59e0b" },
]

const funnelData = [
  { stage: "Sessions", value: 125000, percentage: 100 },
  { stage: "Product Views", value: 87500, percentage: 70 },
  { stage: "Add to Cart", value: 11250, percentage: 9 },
  { stage: "Checkout Started", value: 6875, percentage: 5.5 },
  { stage: "Purchases", value: 3750, percentage: 3 },
]

export function WebsiteData() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Website Analytics</h2>
        <p className="text-muted-foreground mt-1">Track visitor behavior and conversion performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="AOV" value="$114.28" change={7.5} icon={ShoppingCart} variant="success" />
        <MetricCard title="Conversion Rate" value="3.2%" change={12.8} icon={Percent} variant="success" />
        <MetricCard title="Engagement Rate" value="68.4%" change={4.2} icon={Eye} />
        <MetricCard title="ATC Rate" value="9.2%" change={8.1} icon={MousePointerClick} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Returning Customers" value="42%" change={5.3} icon={UserCheck} />
        <MetricCard title="New Customers" value="58%" change={-2.1} icon={UserPlus} />
        <MetricCard title="Repeat Purchase Rate" value="28.5%" change={9.7} icon={RefreshCw} variant="success" />
        <MetricCard title="Refund Rate" value="2.8%" change={-15.2} icon={AlertTriangle} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">CVR & ATC Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="cvr"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                    name="CVR"
                  />
                  <Line
                    type="monotone"
                    dataKey="atc"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    name="ATC Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                <span className="text-sm text-muted-foreground">ATC Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((item, index) => (
                <div key={item.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.stage}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.value.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Customer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {customerTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6">
              {customerTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Ad Traffic Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {trafficSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6">
              {trafficSourceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
