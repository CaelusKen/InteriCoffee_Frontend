import React from 'react'

interface RatingProps {
  score: number
  maxScore?: number
  label?: string
}

export default function RatingCard({ score, maxScore = 10, label = 'Rating' }: RatingProps) {
  const formattedScore = score.toFixed(2)

  return (
    <div className="inline-flex flex-col items-center justify-center border-black border-[1px] text-black dark:bg-gray-800 dark:text-white rounded-lg p-2 w-20 h-24">
      <span className="text-xs font-semibold">{label}</span>
      <span className="text-2xl font-bold">{formattedScore}</span>
      <span className="text-xs">/{maxScore}</span>
    </div>
  )
}