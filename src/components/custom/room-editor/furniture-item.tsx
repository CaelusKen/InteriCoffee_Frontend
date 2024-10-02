'use client'

import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import { Furniture } from '@/types/room-editor'
import * as THREE from 'three'

interface FurnitureItemProps extends Furniture {
  onSelect: () => void;
  isSelected: boolean;
}

export default function FurnitureItem({ model, position, rotation, scale, onSelect, isSelected, name }: FurnitureItemProps) {
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
      if (groupRef.current && !isSelected) {
        groupRef.current.rotation.y += 0.01
      }
    })
  
    return (
      <group 
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <primitive object={scene.clone()} />
        {isSelected && (
          <Html>
            <div className="bg-background text-foreground p-2 rounded">
              {name}
            </div>
          </Html>
        )}
      </group>
    )
}