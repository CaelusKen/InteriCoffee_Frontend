'use client'

import React, { useState, useEffect, useRef } from 'react'
import { OrbitControls, Grid, Environment, Sky, Stats } from '@react-three/drei'
import { Furniture, Room, TransformUpdate } from '@/types/room-editor'
import { useThree } from '@react-three/fiber'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import FurnitureItem from './furniture-item'
import RoomComponent from './room'
import * as THREE from 'three'

import CustomTransformControls from './transform-controls'
interface SceneViewProps {
  room: Room
  furniture: Furniture[]
  selectedItem: number | null
  onSelectItem: (id: number) => void
  onUpdateTransform: (update: TransformUpdate) => void
  transformMode: 'translate' | 'rotate' | 'scale'
}

export default function SceneView({
  room,
  furniture,
  selectedItem,
  onSelectItem,
  onUpdateTransform,
  transformMode,
}: SceneViewProps) {
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null)
  const orbitControlsRef = useRef<OrbitControlsImpl>(null)
  const { scene } = useThree()

  useEffect(() => {
    if (selectedItem !== null) {
      const object = scene.getObjectByName(`furniture-${selectedItem}`)
      if (object) {
        setSelectedObject(object)
      } else {
        setSelectedObject(null)
      }
    } else {
      setSelectedObject(null)
    }
  }, [selectedItem, scene])

  const handleTransformChange = () => {
    if (selectedObject && selectedItem !== null) {
      onUpdateTransform({
        id: selectedItem,
        type: 'position',
        value: selectedObject.position.toArray() as [number, number, number],
      })
      onUpdateTransform({
        id: selectedItem,
        type: 'rotation',
        value: selectedObject.rotation.toArray().slice(0, 3) as [number, number, number],
      })
      onUpdateTransform({
        id: selectedItem,
        type: 'scale',
        value: selectedObject.scale.toArray() as [number, number, number],
      })
    }
  }

  return (
    <>
      <RoomComponent {...room} />
      {furniture.map((item) => (
        <FurnitureItem
          key={item.id}
          {...item}
          onSelect={() => onSelectItem(item.id)}
          isSelected={selectedItem === item.id}
        />
      ))}
      {selectedObject && (
        <CustomTransformControls
          object={selectedObject}
          mode={transformMode}
          onObjectChange={handleTransformChange}
        />
      )}
      <OrbitControls ref={orbitControlsRef} makeDefault />
      <Grid infiniteGrid />
      <Environment preset="apartment" />
      <Sky />
      <Stats className="!absolute !bottom-2 !right-2 !left-auto !top-auto" />
    </>
  )
}