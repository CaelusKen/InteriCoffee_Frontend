'use client'

import React, { useRef, useEffect } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { Furniture } from '@/types/room-editor'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface FurnitureItemProps extends Furniture {
  onSelect: () => void;
  isSelected: boolean;
}

export default function FurnitureItem({ id, model, position, rotation, scale, onSelect, isSelected, name }: FurnitureItemProps) {
  const { scene } = useGLTF(model)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position)
      groupRef.current.rotation.set(...rotation)
      groupRef.current.scale.set(...scale)
    }
  }, [position, rotation, scale])

  useFrame(() => {
    if (groupRef.current && isSelected) {
      // Update position, rotation, and scale in real-time
      const newPosition = groupRef.current.position.toArray()
      const newRotation = groupRef.current.rotation.toArray().slice(0, 3)
      const newScale = groupRef.current.scale.toArray()

      // You would need to implement these update functions in your parent component
      // onUpdatePosition(id, newPosition as [number, number, number])
      // onUpdateRotation(id, newRotation as [number, number, number])
      // onUpdateScale(id, newScale as [number, number, number])
    }
  })

  return (
    <group 
      ref={groupRef}
      name={`furniture-${id}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <primitive object={scene.clone()} />
      {isSelected && (
        <>
          <Html>
            <div className="bg-background text-foreground p-2 rounded">
              {name}
            </div>
          </Html>
          <mesh>
            <boxGeometry args={[1.05, 1.05, 1.05]} />
            <meshBasicMaterial color="yellow" wireframe />
          </mesh>
        </>
      )}
    </group>
  )
}