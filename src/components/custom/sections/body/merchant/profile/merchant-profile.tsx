"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, Phone, Building, UserPlus, Package, Megaphone } from "lucide-react"

interface Activity {
  type: "assign" | "product" | "campaign" | "consultant"
  content: string
  date: string
}

interface MerchantData {
  name: string
  email: string
  phone: string
  avatar: string
  companyName: string
  approvedBy: string
  recentActivities: Activity[]
}

export default function MerchantProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [merchant, setMerchant] = useState<MerchantData>({
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 (555) 987-6543",
    avatar: "/placeholder.svg?height=128&width=128",
    companyName: "Smith Enterprises",
    approvedBy: "Manager Jane Doe",
    recentActivities: [
      { type: "assign", content: "Assigned Consultant Tom to Customer Support", date: "2023-05-20" },
      { type: "product", content: "Added new product 'Super Gadget'", date: "2023-05-18" },
      { type: "campaign", content: "Created 'Summer Sale' campaign", date: "2023-05-15" },
      { type: "consultant", content: "Created new Consultant account for Sarah", date: "2023-05-10" },
    ]
  })

  const handleSave = () => {
    // Here you would typically send the updated merchant data to your backend
    setIsEditing(false)
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "assign":
        return <UserPlus className="h-4 w-4" />
      case "product":
        return <Package className="h-4 w-4" />
      case "campaign":
        return <Megaphone className="h-4 w-4" />
      case "consultant":
        return <UserPlus className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto py-8 ">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Merchant Profile</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={merchant.avatar} alt={merchant.name} />
                  <AvatarFallback>{merchant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {isEditing ? (
                  <Input
                    value={merchant.name}
                    onChange={(e) => setMerchant({ ...merchant, name: e.target.value })}
                    className="mt-4"
                  />
                ) : (
                  <h2 className="mt-4 text-2xl font-bold">{merchant.name}</h2>
                )}
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={merchant.companyName}
                      onChange={(e) => setMerchant({ ...merchant, companyName: e.target.value })}
                    />
                  ) : (
                    <span>{merchant.companyName}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={merchant.email}
                      onChange={(e) => setMerchant({ ...merchant, email: e.target.value })}
                    />
                  ) : (
                    <span>{merchant.email}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={merchant.phone}
                      onChange={(e) => setMerchant({ ...merchant, phone: e.target.value })}
                    />
                  ) : (
                    <span>{merchant.phone}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Approved by: {merchant.approvedBy}</span>
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
                {merchant.recentActivities.map((activity, index) => (
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