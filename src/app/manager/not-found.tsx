import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">Oops! The merchant page you're looking for doesn't exist.</p>
      <Button asChild>
        <Link href="/merchant">
          Return to Merchant Dashboard
        </Link>
      </Button>
    </div>
  )
}