"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, TrendingUp, TrendingDown, Minus, Bot, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const defaultInsights = [
  {
    metric: "Total Revenue",
    value: "$847,329",
    change: 23.5,
    trend: "up" as const,
    insight:
      "Revenue has increased by 23.5% compared to last month, primarily driven by higher conversion rates and increased average order value.",
  },
  {
    metric: "Net Profit",
    value: "$312,847",
    change: 18.2,
    trend: "up" as const,
    insight: "Net profit margins have improved due to reduced shipping costs and better supplier negotiations.",
  },
  {
    metric: "CAC (Customer Acquisition Cost)",
    value: "$32.50",
    change: -12.3,
    trend: "down" as const,
    insight:
      "Your customer acquisition cost has decreased, indicating more efficient ad spending. Your Meta campaigns are performing particularly well.",
  },
  {
    metric: "ROAS",
    value: "4.2x",
    change: 8.7,
    trend: "up" as const,
    insight:
      "Return on ad spend has improved across all channels. Consider allocating more budget to Google Ads which shows the highest ROAS.",
  },
  {
    metric: "Conversion Rate",
    value: "3.8%",
    change: 0.4,
    trend: "up" as const,
    insight: "Slight improvement in conversion rate. The new checkout flow appears to be reducing cart abandonment.",
  },
  {
    metric: "Refund Rate",
    value: "4.2%",
    change: 1.8,
    trend: "down" as const,
    insight:
      "Refund rate has increased slightly. Consider reviewing product descriptions and sizing guides to reduce returns.",
  },
  {
    metric: "Average Order Value",
    value: "$127.50",
    change: 5.3,
    trend: "up" as const,
    insight: "AOV is trending upward. Your upselling strategies and bundle offers are working effectively.",
  },
  {
    metric: "Ad Spend",
    value: "$45,230",
    change: 15.0,
    trend: "up" as const,
    insight:
      "Ad spend increased but is justified by the higher ROAS. Monitor closely to ensure efficiency is maintained.",
  },
]

function InsightCard({ metric, value, change, trend, insight }: (typeof defaultInsights)[0]) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const isPositive =
    (trend === "up" &&
      metric !== "Refund Rate" &&
      metric !== "CAC (Customer Acquisition Cost)" &&
      metric !== "Ad Spend") ||
    (trend === "down" && (metric === "Refund Rate" || metric === "CAC (Customer Acquisition Cost)"))

  return (
    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm text-muted-foreground">{metric}</p>
          <p className="text-xl font-semibold text-foreground">{value}</p>
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-success" : "text-destructive"}`}>
          <TrendIcon className="w-4 h-4" />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
    </div>
  )
}

export function AIInsights() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your current metrics, I recommend focusing on reducing your CAC further by optimizing your Meta ad targeting. Your ROAS is healthy at 4.2x, but there's room to improve efficiency.",
        "Looking at your conversion funnel, the add-to-cart rate is strong but checkout completion could be improved. Consider adding trust badges and simplifying the checkout process.",
        "Your repeat purchase rate of 28.5% is above industry average. To grow this further, consider implementing a loyalty program or subscription offering for your best-selling products.",
        "The refund rate increase warrants attention. I'd recommend analyzing which products have the highest return rates and addressing quality or description issues.",
        "Your gross margin of 42.8% is healthy. To improve profitability further, consider negotiating better rates with suppliers or exploring alternative shipping partners.",
      ]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI Insights</h2>
        <p className="text-muted-foreground">Get intelligent analysis and recommendations for your metrics</p>
      </div>

      <Card className="bg-card border-border h-[calc(100vh-220px)] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="space-y-6">
                {/* Welcome message */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Welcome to AI Insights</p>
                    <p className="text-sm text-muted-foreground">
                      Here&apos;s a summary of your key metrics and performance highlights. Ask me anything about your
                      data!
                    </p>
                  </div>
                </div>

                {/* Default insights grid */}
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {defaultInsights.map((insight, index) => (
                    <InsightCard key={index} {...insight} />
                  ))}
                </div>

                {/* Summary */}
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-1">Overall Performance Summary</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Your e-commerce store is performing well this period. Revenue and profit are both up
                        significantly, driven by improved conversion rates and efficient ad spend. Key areas to monitor
                        include the slight increase in refund rates and continued optimization of customer acquisition
                        costs. Consider scaling your best-performing ad campaigns while the ROAS remains strong.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "user" ? "bg-primary" : "bg-primary/20"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-secondary p-3 rounded-lg">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your metrics..."
                className="flex-1 bg-secondary border-border"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI can make mistakes. Verify important insights with your actual data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
