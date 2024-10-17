"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Building, ShieldCheck } from "lucide-react"

interface ManagerData {
  name: string
  email: string
  phone: string
  avatar: string
  role: string
  department: string
}

export default function ManagerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [manager, setManager] = useState<ManagerData>({
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 (555) 876-5432",
    avatar: "/placeholder.svg?height=128&width=128",
    role: "System Administrator",
    department: "IT Operations"
  })

  const handleSave = () => {
    // Here you would typically send the updated manager data to your backend
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Manager Profile</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={manager.avatar} alt={manager.name} />
              <AvatarFallback>{manager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              {isEditing ? (
                <Input
                  value={manager.name}
                  onChange={(e) => setManager({ ...manager, name: e.target.value })}
                  className="mb-2"
                />
              ) : (
                <h2 className="text-2xl font-bold">{manager.name}</h2>
              )}
              <Badge variant="secondary">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Manager
              </Badge>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <Building className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{manager.role}, {manager.department}</span>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  value={manager.email}
                  onChange={(e) => setManager({ ...manager, email: e.target.value })}
                />
              ) : (
                <span>{manager.email}</span>
              )}
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  value={manager.phone}
                  onChange={(e) => setManager({ ...manager, phone: e.target.value })}
                />
              ) : (
                <span>{manager.phone}</span>
              )}
            </div>
          </div>
          {isEditing && (
            <Button onClick={handleSave} className="mt-4 w-full">Save Changes</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}