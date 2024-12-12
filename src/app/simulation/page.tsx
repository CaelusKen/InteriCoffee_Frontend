'use client'

import React, { useState, useEffect } from 'react'
import RoomEditor from '@/components/custom/room-editor/room-editor'

export default function SimulationPage()  {
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024) // 1024px is the default 'lg' breakpoint in Tailwind
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  if (!isLargeScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-100 text-secondary-900">
        <div className="text-center p-8 bg-primary-50 rounded-lg shadow-xl max-w-md">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-primary-800">Oops! Screen Too Small</h1>
          <p className="text-lg mb-6 text-secondary-700">
            Our Room Editor needs more space to brew up some great designs. 
            Please use a larger screen (at least 1024px wide) to access this feature.
          </p>
          <div className="flex justify-center space-x-4">
            <span className="inline-block bg-primary-200 rounded-full px-3 py-1 text-sm font-semibold text-primary-700">
              ☕ Take a coffee break
            </span>
            <span className="inline-block bg-primary-200 rounded-full px-3 py-1 text-sm font-semibold text-primary-700">
              🖥️ Find a bigger screen
            </span>
          </div>
        </div>
      </div>
    )
  }

  return <RoomEditor />
}
