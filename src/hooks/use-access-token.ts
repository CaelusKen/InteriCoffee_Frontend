import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

async function fetchAccessToken() {
  const response = await fetch('/api/auth/set-access-token', {
    method: 'GET',
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Failed to fetch access token')
  }
  const data = await response.json()
  return data.accessToken
}

export function useAccessToken() {
  const { data: session } = useSession()

  const { data: accessToken } = useQuery({
    queryKey: ['accessToken', session?.user?.accessToken],
    queryFn: () => session?.user?.accessToken ? Promise.resolve(session.user.accessToken) : fetchAccessToken(),
    enabled: !!session,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  return accessToken
}

