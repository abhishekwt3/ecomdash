"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Truck, Package, Users, DollarSign, Megaphone, Wrench, Trash2, Edit, MoreHorizontal, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

// Keep existing icon/color maps...
const categoryIcons: Record<string, any> = {
  shipping: Truck,
  packaging: Package,
  commissions: Users,
  salaries: DollarSign,
  "ad-spend": Megaphone,
  tools: Wrench,
  other: DollarSign
}

const categoryColors: Record<string, string> = {
  shipping: "#3b82f6",
  packaging: "#f59e0b",
  commissions: "#22c55e",
  salaries: "#ef4444",
  "ad-spend": "#8b5cf6",
  tools: "#ec4899",
  other: "#94a3b8"
}

export function CostCentre() {
  const { user } = useAuth();
  const [costs, setCosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [newCost, setNewCost] = useState({
    category: "",
    name: "",
    amount: "",
    frequency: "monthly"
  })

  // Fetch costs on load
  useEffect(() => {
    fetchCosts();
  }, [user]);

  const fetchCosts = async () => {
    try {
      const data = await apiClient.getCosts(user?.activeWorkspace?._id);
      setCosts(data);
    } catch (error) {
      console.error("Failed to fetch costs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCost = async () => {
    if (!newCost.category || !newCost.name || !newCost.amount) return
    
    setSubmitting(true);
    try {
      await apiClient.createCost(user?.activeWorkspace?._id, {
        category: newCost.category,
        name: newCost.name,
        amount: Number.parseFloat(newCost.amount),
        frequency: newCost.frequency
      });
      
      toast.success("Cost added successfully");
      fetchCosts(); // Refresh list
      setNewCost({ category: "", name: "", amount: "", frequency: "monthly" })
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Failed to add cost");
    } finally {
      setSubmitting(false);
    }
  }

  const handleDeleteCost = async (id: string) => {
    try {
      await apiClient.deleteCost(id);
      toast.success("Cost removed");
      setCosts(costs.filter((cost) => cost._id !== id));
    } catch (error) {
      toast.error("Failed to delete cost");
    }
  }

  // Calculations
  const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0)
  const costsByCategory = costs.reduce((acc, cost) => {
      if (!acc[cost.category]) acc[cost.category] = 0
      acc[cost.category] += cost.amount
      return acc
    }, {} as Record<string, number>)

  const pieData = Object.entries(costsByCategory).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1).replace("-", " "),
    value: amount,
    color: categoryColors[category] || "#94a3b8",
  }))

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

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
                <Label>Category</Label>
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
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., FedEx Shipping"
                  value={newCost.name}
                  onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newCost.amount}
                  onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <Button onClick={handleAddCost} className="w-full" disabled={submitting}>
                {submitting ? "Adding..." : "Add Cost"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
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
        {/* ... Other summary cards (Ad Spend, Tools) same as before ... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
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
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((cost) => {
                    const Icon = categoryIcons[cost.category] || DollarSign
                    return (
                      <tr key={cost._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${categoryColors[cost.category]}20` }}>
                              <Icon className="w-4 h-4" style={{ color: categoryColors[cost.category] }} />
                            </div>
                            <span className="text-sm capitalize">{cost.category.replace("-", " ")}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{cost.name}</td>
                        <td className="py-3 px-4 text-sm text-right font-medium">${cost.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteCost(cost._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                  {costs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-muted-foreground">No costs added yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {costs.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} labelStyle={{ color: "#f3f4f6" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Add costs to see breakdown</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}