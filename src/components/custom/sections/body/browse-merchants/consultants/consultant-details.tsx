import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Consultant = {
  id: string
  name: string
  specialization: string
  bio: string
}

export default function ConsultantProfile({ consultant }: { consultant: Consultant }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{consultant.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold">Specialization: {consultant.specialization}</p>
        <p className="mt-4 text-muted-foreground">{consultant.bio}</p>
      </CardContent>
    </Card>
  )
}