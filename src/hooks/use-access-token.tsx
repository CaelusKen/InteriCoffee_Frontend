import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function useAccessToken() {
  const { data: session } = useSession()
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccessToken = async () => {
      if (session?.user?.accessToken) {
        setAccessToken(session.user.accessToken)
      } else {
        try {
          const response = await fetch('/api/auth/set-access-token', {
            method: 'GET',
            credentials: 'include',
          })
          if (response.ok) {
            const data = await response.json()
            setAccessToken(data.accessToken)
          }
        } catch (error) {
          console.error('Error fetching access token:', error)
        }
      }
    }

    fetchAccessToken()
  }, [session])

  return accessToken
}