'use client'

import { useState, useEffect } from 'react'

export default function LoadingPage() {
  const [loadingText, setLoadingText] = useState('Loading')

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((text) => {
        if (text === 'Loading...') return 'Loading'
        return text + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{loadingText}</h2>
      <div className="w-64 h-2 bg-black dark:bg-white rounded-full overflow-hidden">
        <div className="w-full h-full bg-black dark:bg-white origin-left animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
    </div>
  )
}