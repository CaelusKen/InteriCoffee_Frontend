'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface WebsiteMetadata {
  title: string
  description: string
}

async function fetchWebsiteMetadata(url: string): Promise<WebsiteMetadata> {
  const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch website metadata')
  }
  return response.json()
}

export default function WebsitePreviewCard({ url }: { url: string }) {
  const [metadata, setMetadata] = useState<WebsiteMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWebsiteMetadata(url)
      .then(setMetadata)
      .catch((err) => setError(err.message))
  }, [url])

  const previewImageUrl = `https://og-image.vercel.app/${encodeURIComponent(
    url
  )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg`

  return (
    <div>
        <h2 className='font-semibold mt-2'>Merchant Website</h2>
        <Card className="w-full max-w-md overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={previewImageUrl}
              alt={`Preview of ${url}`}
              className="object-cover w-full h-full"
            />
          </div>
          <CardFooter className="p-4 pt-0">
            <Button variant="outline" className="w-full" onClick={() => window.open(url, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Button>
          </CardFooter>
        </Card>
    </div>
  )
}