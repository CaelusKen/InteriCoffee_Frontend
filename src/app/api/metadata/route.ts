import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || ''
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || ''

    return NextResponse.json({ title, description })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch website metadata' }, { status: 500 })
  }
}