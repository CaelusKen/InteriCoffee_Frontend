import React, { useEffect, useRef } from 'react'
import { TransformControls } from '@react-three/drei'
import * as THREE from 'three'

interface CustomTransformControlsProps {
  object: THREE.Object3D
  mode: 'translate' | 'rotate' | 'scale'
  onObjectChange: () => void
}

export default function CustomTransformControls({ object, mode, onObjectChange }: CustomTransformControlsProps) {
  const transformRef = useRef<any>(null)

  useEffect(() => {
    if (transformRef.current) {
      transformRef.current.setRotationSnap(Math.PI / 180) // Set rotation snap to 1 degree
    }
  }, [])

  return (
    <TransformControls
      ref={transformRef}
      object={object}
      mode={mode}
      onObjectChange={onObjectChange}
      rotationSnap={Math.PI / 180}
      translationSnap={0.1}
      scaleSnap={0.1}
    />
  )
}