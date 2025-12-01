"use client"

import { MetricCard } from "@/components/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DollarSign,
  Target,
  MousePointerClick,
  TrendingUp,
  BarChart3,
  Users,
  Percent,
  ArrowRightLeft,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart, CartesianGrid } from "recharts"

const roasData = [
  { date: "Mon", roas: 3.2, breakeven: 2.5 },
  { date: "Tue", roas: 3.8, breakeven: 2.5 },
  { date: "Wed", roas: 3.1, breakeven: 2.5 },
  { date: "Thu", roas: 4.2, breakeven: 2.5 },
  { date: "Fri", roas: 3.9, breakeven: 2.5 },
  { date: "Sat", roas: 4.5, breakeven: 2.5 },
  { date: "Sun", roas: 4.1, breakeven: 2.5 },
]

const cacData = [
  { date: "Week 1", cac: 32, maxCac: 45 },
  { date: "Week 2", cac: 28, maxCac: 45 },
  { date: "Week 3", cac: 35, maxCac: 45 },
  { date: "Week 4", cac: 30, maxCac: 45 },
]

const channelData = [
  { channel: "Meta", spend: 25000, revenue: 95000, roas: 3.8 },
  { channel: "Google", spend: 18000, revenue: 72000, roas: 4.0 },
  { channel: "TikTok", spend: 8000, revenue: 24000, roas: 3.0 },
  { channel: "Pinterest", spend: 4000, revenue: 14000, roas: 3.5 },
]

export function AdsData() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Advertising Metrics</h2>
        <p className="text-muted-foreground mt-1">Monitor your ad performance and acquisition costs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="CAC" value="$31.50" change={-8.2} icon={Users} variant="success" />
        <MetricCard title="Max CAC" value="$45.00" icon={Target} />
        <MetricCard title="ROAS" value="3.8x" change={12.4} icon={TrendingUp} variant="success" />
        <MetricCard title="Break-even ROAS" value="2.5x" icon={ArrowRightLeft} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="MPAS" value="$42,600" change={15.8} icon={DollarSign} variant="success" />
        <MetricCard title="MER" value="4.2" change={6.3} icon={BarChart3} />
        <MetricCard title="SPE" value="$12.80" change={-4.5} icon={MousePointerClick} variant="success" />
        <MetricCard title="CTR" value="2.4%" change={8.9} icon={Percent} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="CPC" value="$0.85" change={-12.3} icon={MousePointerClick} variant="success" />
        <MetricCard title="CPM" value="$8.50" change={3.2} icon={Users} />
        <MetricCard title="Total Ad Spend" value="$55,000" change={5.8} icon={DollarSign} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">ROAS vs Break-even</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}x`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
                    formatter={(value: number) => [`${value}x`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="roas"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                    name="ROAS"
                  />
                  <Line
                    type="monotone"
                    dataKey="breakeven"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Break-even"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <span className="text-sm text-muted-foreground">ROAS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[#f59e0b]" style={{ borderStyle: "dashed" }} />
                <span className="text-sm text-muted-foreground">Break-even</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">CAC Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cacData}>
                  <defs>
                    <linearGradient id="cacGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
                    formatter={(value: number) => [`$${value}`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="cac"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#cacGradient)"
                    name="CAC"
                  />
                  <Line
                    type="monotone"
                    dataKey="maxCac"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Max CAC"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                <span className="text-sm text-muted-foreground">CAC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[#ef4444]" />
                <span className="text-sm text-muted-foreground">Max CAC</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Channel</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Ad Spend</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {channelData.map((row) => (
                  <tr key={row.channel} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{row.channel}</td>
                    <td className="py-3 px-4 text-sm text-right text-muted-foreground">
                      ${row.spend.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-success">${row.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium">{row.roas}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
