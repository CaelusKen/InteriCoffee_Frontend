import React, { useEffect, useRef } from 'react'
import { TransformControls as DreiTransformControls } from '@react-three/drei'
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
      transformRef.current.setRotationSnap(THREE.MathUtils.degToRad(15)) // Set rotation snap to 15 degrees
      transformRef.current.setTranslationSnap(0.5) // Set translation snap to 0.5 units
      transformRef.current.setScaleSnap(0.25) // Set scale snap to 0.25 units
    }
  }, [])

  const handleChange = () => {
    if (object) {
      const worldPosition = new THREE.Vector3()
      const worldQuaternion = new THREE.Quaternion()
      const worldScale = new THREE.Vector3()

      object.getWorldPosition(worldPosition)
      object.getWorldQuaternion(worldQuaternion)
      object.getWorldScale(worldScale)

      object.position.copy(worldPosition)
      object.quaternion.copy(worldQuaternion)
      object.scale.copy(worldScale)

      // Reset the object's world matrix
      object.updateMatrix()
      object.matrix.decompose(object.position, object.quaternion, object.scale)

      // Ensure rotation is properly updated and normalized
      const rotation = new THREE.Euler().setFromQuaternion(object.quaternion)
      object.rotation.set(
        normalizeAngle(rotation.x),
        normalizeAngle(rotation.y),
        normalizeAngle(rotation.z)
      )
    }
    onObjectChange()
  }

  // Helper function to normalize angle between -360 and 360 degrees
  const normalizeAngle = (angle: number): number => {
    const degrees = THREE.MathUtils.radToDeg(angle)
    return ((degrees % 360) + 360) % 360 - (degrees > 0 && degrees % 360 === 0 ? 360 : 0)
  }

  return (
    <DreiTransformControls
      ref={transformRef}
      object={object}
      mode={mode}
      onObjectChange={handleChange}
    />
  )
}