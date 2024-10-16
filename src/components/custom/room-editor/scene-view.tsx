import React, { useState, useEffect, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, Sky, Stats } from '@react-three/drei'
import { Furniture, Room, TransformUpdate } from '@/types/room-editor'
import * as THREE from 'three'

import FurnitureItem from './furniture-item'
import RoomComponent from './room'
import CustomTransformControls from './transform-controls'

interface SceneContentProps {
  room: Room
  furniture: Furniture[]
  selectedItem: number | null
  onSelectItem: (id: number | null) => void
  onUpdateTransform: (update: TransformUpdate) => void
  transformMode: 'translate' | 'rotate' | 'scale'
}

export default function SceneContent({
  room,
  furniture,
  selectedItem,
  onSelectItem,
  onUpdateTransform,
  transformMode,
}: SceneContentProps) {
  const { scene, gl } = useThree()
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null)

  useEffect(() => {
    if (selectedItem !== null) {
      const object = scene.getObjectByName(`furniture-${selectedItem}`)
      setSelectedObject(object || null)
    } else {
      setSelectedObject(null)
    }
  }, [selectedItem, scene])

  const handleObjectChange = useCallback(() => {
    if (selectedObject && selectedItem !== null) {
      onUpdateTransform({
        id: selectedItem,
        type: 'position',
        value: selectedObject.position.toArray() as [number, number, number],
      })
      onUpdateTransform({
        id: selectedItem,
        type: 'rotation',
        value: selectedObject.rotation.toArray().slice(0, 3).map(v => Number(v || 0) * (180 / Math.PI)) as [number, number, number],
      })
      onUpdateTransform({
        id: selectedItem,
        type: 'scale',
        value: selectedObject.scale.toArray() as [number, number, number],
      })
    }
  }, [selectedObject, selectedItem, onUpdateTransform])

  const handleSceneClick = useCallback((event: THREE.Event) => {
    if (event.target === gl.domElement) {
      onSelectItem(null)
    }
  }, [gl, onSelectItem])

  useEffect(() => {
    gl.domElement.addEventListener('click', handleSceneClick)
    return () => {
      gl.domElement.removeEventListener('click', handleSceneClick)
    }
  }, [gl, handleSceneClick])

  return (
    <>
      <RoomComponent {...room} />
      {furniture.map((item) => (
        <FurnitureItem
          key={item.id}
          {...item}
          onSelect={(event) => {
            onSelectItem(item.id);
          }}
          isSelected={selectedItem === item.id}
          onUpdateTransform={onUpdateTransform}
          roomDimensions={room}
        />
      ))}
      {selectedObject && (
        <CustomTransformControls
          object={selectedObject}
          mode={transformMode}
          onObjectChange={handleObjectChange}
        />
      )}
      <OrbitControls makeDefault />
      <Grid infiniteGrid />
      <Environment preset="apartment" />
      <Sky />
      <Stats className="!absolute !bottom-2 !right-2 !left-auto !top-auto" />
    </>
  )
}