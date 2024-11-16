import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Merchant = {
  id: string
  name: string
  description: string
}

export default function MerchantList({ merchants }: { merchants: Merchant[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {merchants.map((merchant) => (
        <Card key={merchant.id}>
          <CardHeader>
            <CardTitle>{merchant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{merchant.description}</p>
            <Link href={`/merchants/${merchant.id}`} passHref>
              <Button className="mt-4">View Profile</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}