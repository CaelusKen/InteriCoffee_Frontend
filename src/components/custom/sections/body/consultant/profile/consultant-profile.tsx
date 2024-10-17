    "use client"

    import { useState } from "react"
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
    import { Badge } from "@/components/ui/badge"
    import { CalendarDays, Mail, Phone, Building, MessageSquare, Pencil } from "lucide-react"

    interface Activity {
    type: "template" | "reply"
    content: string
    date: string
    }

    interface ConsultantData {
    name: string
    email: string
    phone: string
    avatar: string
    company: string
    recentActivities: Activity[]
    }

    export default function ConsultantProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const [consultant, setConsultant] = useState<ConsultantData>({
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1 (555) 234-5678",
        avatar: "/placeholder.svg?height=128&width=128",
        company: "Smith Enterprises",
        recentActivities: [
        { type: "template", content: "Published 'Modern Business' template", date: "2023-05-20" },
        { type: "reply", content: "Replied to customer inquiry about pricing", date: "2023-05-18" },
        { type: "template", content: "Edited 'Sleek Portfolio' template", date: "2023-05-15" },
        { type: "reply", content: "Assisted customer with design customization", date: "2023-05-10" },
        ]
    })

    const handleSave = () => {
        // Here you would typically send the updated consultant  data to your backend
        setIsEditing(false)
    }

    const getActivityIcon = (type: Activity["type"]) => {
        switch (type) {
        case "template":
            return <Pencil className="h-4 w-4" />
        case "reply":
            return <MessageSquare className="h-4 w-4" />
        }
    }

    return (
        <div className="container mx-auto py-4">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
            <Card>
                <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Consultant Profile</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit"}
                    </Button>
                </div>
                </CardHeader>
                <CardContent>
                <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32">
                    <AvatarImage src={consultant.avatar} alt={consultant.name} />
                    <AvatarFallback>{consultant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {isEditing ? (
                    <Input
                        value={consultant.name}
                        onChange={(e) => setConsultant({ ...consultant, name: e.target.value })}
                        className="mt-4"
                    />
                    ) : (
                    <h2 className="mt-4 text-2xl font-bold">{consultant.name}</h2>
                    )}
                </div>
                <div className="mt-6 space-y-4">
                    <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{consultant.company}</span>
                    </div>
                    <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                        <Input
                        value={consultant.email}
                        onChange={(e) => setConsultant({ ...consultant, email: e.target.value })}
                        />
                    ) : (
                        <span>{consultant.email}</span>
                    )}
                    </div>
                    <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                        <Input
                        value={consultant.phone}
                        onChange={(e) => setConsultant({ ...consultant, phone: e.target.value })}
                        />
                    ) : (
                        <span>{consultant.phone}</span>
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
                    {consultant.recentActivities.map((activity, index) => (
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