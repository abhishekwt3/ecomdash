"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Truck, Package, Users, DollarSign, Megaphone, Wrench, Trash2, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

const categoryIcons: Record<string, any> = {
  shipping: Truck,
  packaging: Package,
  commissions: Users,
  salaries: DollarSign,
  "ad-spend": Megaphone,
  tools: Wrench,
}

const categoryColors: Record<string, string> = {
  shipping: "#3b82f6",
  packaging: "#f59e0b",
  commissions: "#22c55e",
  salaries: "#ef4444",
  "ad-spend": "#8b5cf6",
  tools: "#ec4899",
}

export function CostCentre() {
  const { user } = useAuth()
  const [costs, setCosts] = useState<any[]>([])
  const [breakdown, setBreakdown] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  type CostFrequency = "one-time" | "monthly" | "yearly"
  type NewCost = {
    category: string
    name: string
    amount: string
    frequency: CostFrequency
    description: string
  }
  const [newCost, setNewCost] = useState<NewCost>({
    category: "",
    name: "",
    amount: "",
    frequency: "monthly",
    description: "",
  })

  useEffect(() => {
    if (user?.activeWorkspace?.id) {
      fetchCosts()
      fetchBreakdown()
    }
  }, [user])

  const fetchCosts = async () => {
    try {
      const response = await apiClient.getCosts(user!.activeWorkspace.id)
      if (response.success) {
        setCosts(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch costs:', error)
      toast.error('Failed to load costs')
    } finally {
      setLoading(false)
    }
  }

  const fetchBreakdown = async () => {
    try {
      const response = await apiClient.getCostBreakdown(user!.activeWorkspace.id)
      if (response.success) {
        setBreakdown(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch breakdown:', error)
    }
  }

  const handleAddCost = async () => {
    if (!newCost.category || !newCost.name || !newCost.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await apiClient.createCost(user!.activeWorkspace.id, {
        ...newCost,
        amount: parseFloat(newCost.amount),
      })

      if (response.success) {
        toast.success('Cost added successfully')
        setNewCost({ category: "", name: "", amount: "", frequency: "monthly", description: "" })
        setIsDialogOpen(false)
        fetchCosts()
        fetchBreakdown()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add cost')
    }
  }

  const handleDeleteCost = async (id: string) => {
    try {
      const response = await apiClient.deleteCost(user!.activeWorkspace.id, id)
      if (response.success) {
        toast.success('Cost deleted successfully')
        fetchCosts()
        fetchBreakdown()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete cost')
    }
  }

  const totalCosts = breakdown?.total || 0

  const pieData = breakdown
    ? Object.entries(breakdown)
        .filter(([key]) => key !== 'total')
        .map(([category, amount]: [string, any]) => ({
          name: category.charAt(0).toUpperCase() + category.slice(1).replace("-", " "),
          value: amount,
          color: categoryColors[category] || "#888",
        }))
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading costs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Cost Centre</h2>
          <p className="text-muted-foreground mt-1">Track and manage all your business expenses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Cost
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New Cost</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={newCost.category} onValueChange={(value) => setNewCost({ ...newCost, category: value })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
                    <SelectItem value="commissions">Commissions</SelectItem>
                    <SelectItem value="salaries">Salaries</SelectItem>
                    <SelectItem value="ad-spend">Ad Spend</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  placeholder="e.g., FedEx Shipping"
                  value={newCost.name}
                  onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Amount ($) *</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newCost.amount}
                  onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency *</Label>
                <Select
                  value={newCost.frequency}
                  onValueChange={(value: "one-time" | "monthly" | "yearly") =>
                    setNewCost({ ...newCost, frequency: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Optional description"
                  value={newCost.description}
                  onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <Button onClick={handleAddCost} className="w-full">
                Add Cost
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Monthly Costs</p>
                <p className="text-2xl font-semibold">${totalCosts.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ad Spend</p>
                <p className="text-2xl font-semibold">${(breakdown?.['ad-spend'] || 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-info/20 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tools & Software</p>
                <p className="text-2xl font-semibold">${(breakdown?.tools || 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">All Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Frequency</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((cost) => {
                    const Icon = categoryIcons[cost.category] || Wrench
                    return (
                      <tr key={cost._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: `${categoryColors[cost.category] || '#888'}20`,
                              }}
                            >
                              <Icon className="w-4 h-4" style={{ color: categoryColors[cost.category] || '#888' }} />
                            </div>
                            <span className="text-sm capitalize">{cost.category.replace("-", " ")}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{cost.name}</td>
                        <td className="py-3 px-4 text-sm text-right font-medium">${cost.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right text-muted-foreground capitalize">
                          {cost.frequency}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteCost(cost._id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 && (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
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
                        formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
