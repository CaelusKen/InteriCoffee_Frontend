"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Helper function to format date
function formatDate(dateString: Date) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Helper function to format currency
function formatCurrency(amount: number) {
  const millions = amount / 1000000
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(millions) + 'M đ'
}

interface Order {
  orderDate: Date
  systemIncome: number
  totalAmount: number
}

interface IncomeChartProps {
  orders: Order[]
}

export default function IncomeChart({ orders }: IncomeChartProps) {
  // Sort orders by date and prepare data for the chart
  const chartData = orders
  .reduce((acc, order) => {
    const date = formatDate(order.orderDate)
    const existing = acc.get(date) || { count: 0, income: 0, total: 0 }
    
    acc.set(date, {
      count: existing.count + 1,
      income: existing.income + order.systemIncome,
      total: existing.total + order.totalAmount
    })
    
    return acc
  }, new Map())
  .entries()

  const processedData = Array.from(chartData)
  .map(([date, values]) => ({
    date,
    income: Math.round(values.income / values.count),
    total: Math.round(values.total / values.count)
  }))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Overview</CardTitle>
        <CardDescription>System income and total sales over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            income: {
              label: "System Income",
              color: "hsl(var(--chart-1))",
            },
            total: {
              label: "Total Sales",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                dy={10}
                className="text-sm"
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tickLine={false}
                axisLine={false}
                className="text-sm"
                width={100}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload) return null
                  return (
                    <ChartTooltipContent>
                      {payload.map((item, index) => (
                        <div key={index} className="flex flex-col">
                          <span className="text-sm font-medium">{item.name}:</span>
                          <span className="text-sm">
                            {formatCurrency(item.value as number)}
                          </span>
                        </div>
                      ))}
                    </ChartTooltipContent>
                  )
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}