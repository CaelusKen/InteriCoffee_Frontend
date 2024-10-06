'use client'

import React, { useRef, useEffect } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { Furniture } from '@/types/room-editor'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface FurnitureItemProps extends Furniture {
  onSelect: (event: THREE.Event) => void;
  isSelected: boolean;
  onUpdateTransform: (update: { id: number; type: 'position' | 'rotation' | 'scale'; value: [number, number, number] }) => void;
}

export default function FurnitureItem({ id, model, position, rotation, scale, onSelect, isSelected, name, onUpdateTransform }: FurnitureItemProps) {
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
      const newPosition = groupRef.current.position.toArray() as [number, number, number]
      const newRotation = groupRef.current.rotation.toArray().slice(0, 3) as [number, number, number]
      const newScale = groupRef.current.scale.toArray() as [number, number, number]

      if (!arraysEqual(newPosition, position)) {
        onUpdateTransform({ id, type: 'position', value: newPosition })
      }
      if (!arraysEqual(newRotation, rotation)) {
        onUpdateTransform({ id, type: 'rotation', value: newRotation })
      }
      if (!arraysEqual(newScale, scale)) {
        onUpdateTransform({ id, type: 'scale', value: newScale })
      }
    }
  })

  return (
    <group 
      ref={groupRef}
      name={`furniture-${id}`}
      onClick={onSelect}
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

function arraysEqual(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) < 0.0001);
}