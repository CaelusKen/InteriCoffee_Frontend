import React from 'react'

export default function StyleDetails({ params }: { params: { styleId: string } })  {
  return (
    <div>Style {params.styleId} Details</div>
  )
}