import { useState, useCallback } from 'react'
import * as THREE from 'three'

export function useTransform(initialPosition: [number, number, number], initialRotation: [number, number, number], initialScale: [number, number, number]) {
  const [position, setPosition] = useState(initialPosition)
  const [rotation, setRotation] = useState(initialRotation)
  const [scale, setScale] = useState(initialScale)

  const updateTransform = useCallback((type: 'position' | 'rotation' | 'scale', value: [number, number, number]) => {
    switch (type) {
      case 'position':
        setPosition(value)
        break
      case 'rotation':
        setRotation(value)
        break
      case 'scale':
        setScale(value)
        break
    }
  }, [])

  return { position, rotation, scale, updateTransform }
}