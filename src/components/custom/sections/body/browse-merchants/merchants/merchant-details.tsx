import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Consultant = {
  id: string
  name: string
  specialization?: string
}

type Merchant = {
  id: string
  name: string
  description: string
  consultants: Consultant[]
}

export default function MerchantProfile({ merchant }: { merchant: Merchant }) {
  return (
    <div className="space-y-6 w-full p-8">
      <Card>
        <CardHeader>
          <CardTitle>{merchant.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{merchant.description}</p>
          <Link href={`/messages/${merchant.id}`} passHref>
            <Button className="mt-4">Contact</Button>
          </Link>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-bold mt-6">Consultants</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {merchant.consultants.map((consultant) => (
          <Card key={consultant.id}>
            <CardHeader>
              <CardTitle>{consultant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{consultant.specialization}</p>
              <Link href={`/consultants/${consultant.id}`} passHref>
                <Button variant="outline" className="mt-4">View Profile</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}