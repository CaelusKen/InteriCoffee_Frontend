import React from 'react'
import { TransformControls } from '@react-three/drei'
import * as THREE from 'three'

interface CustomTransformControlsProps {
  object: THREE.Object3D
  mode: 'translate' | 'rotate' | 'scale'
  onObjectChange: () => void
}

export default function CustomTransformControls({ object, mode, onObjectChange }: CustomTransformControlsProps) {
  return (
    <TransformControls object={object} mode={mode} onObjectChange={onObjectChange} />
  )
}