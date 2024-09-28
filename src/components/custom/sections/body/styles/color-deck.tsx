import React from 'react'
import ColorCard from '@/components/custom/cards/color-card'

export const ColorDeck = () => {
  return (
    <div className="px-10 mt-4 grid grid-cols-4 justify-items-stretch gap-8">
      <ColorCard hexColor="#ffffff" />
      <ColorCard hexColor="#000000" stackColor="#4a5568" />
      <ColorCard hexColor="#3498db" stackColor="#2980b9" />
      <ColorCard hexColor="#e74c3c" stackColor="#c0392b" />
      <ColorCard hexColor="#2ecc71" stackColor="#27ae60" />
      <ColorCard hexColor="#f1c40f" stackColor="#f39c12" />
    </div>
  )
}
