import React from 'react'
import { Html, useProgress } from '@react-three/drei'

export function LoadingIndicator() {
  const { progress } = useProgress()
  return <Html center>{progress.toFixed(0)}% loaded</Html>
}