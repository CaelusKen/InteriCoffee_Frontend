"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, Phone, MessageSquare, ShoppingBag, Pencil } from "lucide-react"

interface Activity {
  type: "message" | "purchase" | "design"
  content: string
  date: string
}

interface CustomerData {
  name: string
  email: string
  phone: string
  avatar: string
  recentActivities: Activity[]
}

export default function CustomerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [customer, setCustomer] = useState<CustomerData>({
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=128&width=128",
    recentActivities: [
      { type: "message", content: "Inquired about product availability", date: "2023-05-20" },
      { type: "purchase", content: "Purchased 'Premium Package'", date: "2023-05-18" },
      { type: "design", content: "Edited 'Summer Campaign' design", date: "2023-05-15" },
    ]
  })

  const handleSave = () => {
    // Here you would typically send the updated customer data to your backend
    setIsEditing(false)
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "purchase":
        return <ShoppingBag className="h-4 w-4" />
      case "design":
        return <Pencil className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto py-8 px-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {isEditing ? (
                  <Input
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="mt-4"
                  />
                ) : (
                  <h2 className="mt-4 text-2xl font-bold">{customer.name}</h2>
                )}
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                  ) : (
                    <span>{customer.email}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    />
                  ) : (
                    <span>{customer.phone}</span>
                  )}
                </div>
              </div>
              {isEditing && (
                <Button onClick={handleSave} className="mt-4 w-full">Save Changes</Button>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Badge variant="secondary" className="p-2">
                      {getActivityIcon(activity.type)}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{activity.content}</p>
                      <p className="text-sm text-muted-foreground">
                        <CalendarDays className="inline mr-1 h-3 w-3" />
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}