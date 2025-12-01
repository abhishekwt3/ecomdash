"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon?: LucideIcon
  variant?: "default" | "success" | "warning" | "info"
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon: Icon,
  variant = "default",
  className,
}: MetricCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0
  const isNeutral = change === 0

  const variantStyles = {
    default: "border-border",
    success: "border-success/30",
    warning: "border-warning/30",
    info: "border-info/30",
  }

  return (
    <div
      className={cn(
        "bg-card rounded-lg border p-4 transition-all hover:border-primary/30",
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-card-foreground">{value}</p>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {isPositive && <TrendingUp className="w-4 h-4 text-success" />}
          {isNegative && <TrendingDown className="w-4 h-4 text-destructive" />}
          {isNeutral && <Minus className="w-4 h-4 text-muted-foreground" />}
          <span
            className={cn(
              "text-sm font-medium",
              isPositive && "text-success",
              isNegative && "text-destructive",
              isNeutral && "text-muted-foreground",
            )}
          >
            {isPositive && "+"}
            {change}%
          </span>
          <span className="text-xs text-muted-foreground">{changeLabel}</span>
        </div>
      )}
    </div>
  )
}
