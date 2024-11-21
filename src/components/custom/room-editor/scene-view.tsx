import React, { useState, useEffect, useCallback } from 'react'
import { useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, Sky, Stats, useTexture } from '@react-three/drei'
import { Furniture, Room, TransformUpdate } from '@/types/room-editor'
import * as THREE from 'three'

import FurnitureItem from './furniture-item'
import RoomComponent from './room'
import CustomTransformControls from './transform-controls'

interface SceneContentProps {
  room: Room
  furniture: Furniture[]
  selectedItem: string | null
  onSelectItem: (id: string | null) => void
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

  const woodTexture = useTexture('/textures/wood_floor.jpg')
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping
  woodTexture.repeat.set(5, 5)

  const wallTexture = useTexture('/textures/wall_texture.jpg')
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(2, 2)

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
      <RoomComponent {...room} wallTexture={wallTexture} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[room.width, room.length]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>
      {furniture.map((item) => (
        <FurnitureItem
          key={item.id}
          {...item}
          onSelect={(event) => {
            onSelectItem(item.id)
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
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />
      <OrbitControls makeDefault />
      <Grid infiniteGrid />
      <Environment preset="sunset" />
      <Sky />
      <Stats className="!absolute !bottom-2 !right-2 !left-auto !top-auto" />
    </>
  )
}