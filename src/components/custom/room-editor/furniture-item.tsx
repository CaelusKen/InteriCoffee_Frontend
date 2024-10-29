import React, { useRef, useEffect, useState } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { Furniture } from '@/types/room-editor'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface FurnitureItemProps extends Furniture {
  onSelect: (event: THREE.Event) => void;
  isSelected: boolean;
  onUpdateTransform: (update: { id: number; type: 'position' | 'rotation' | 'scale'; value: [number, number, number] }) => void;
  roomDimensions: { width: number; length: number; height: number };
}

const ROOM_SCALE_FACTOR = 0.1;
const DEFAULT_DIMENSION = 1;

export default function FurnitureItem({ 
  id, 
  model, 
  position, 
  rotation, 
  scale, 
  onSelect, 
  isSelected, 
  name, 
  onUpdateTransform,
  roomDimensions,
  category
}: FurnitureItemProps) {
  const { scene } = useGLTF(model)
  const groupRef = useRef<THREE.Group>(null)
  const [modelDimensions, setModelDimensions] = useState<THREE.Vector3>(new THREE.Vector3(DEFAULT_DIMENSION, DEFAULT_DIMENSION, DEFAULT_DIMENSION))

  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current)
      const size = box.getSize(new THREE.Vector3())
      setModelDimensions(size)
    }
  }, [model])

  useEffect(() => {
    if (groupRef.current && modelDimensions) {
      const maxRoomDimension = Math.max(roomDimensions.width, roomDimensions.length, roomDimensions.height)
      const maxModelDimension = Math.max(modelDimensions.x, modelDimensions.y, modelDimensions.z)
      
      const scaleFactor = (maxRoomDimension * ROOM_SCALE_FACTOR) / maxModelDimension
      
      groupRef.current.scale.set(...scale)
      groupRef.current.position.set(...position)
      groupRef.current.rotation.set(
        Number(rotation[0] || 0) * (Math.PI / 180),
        Number(rotation[1] || 0) * (Math.PI / 180),
        Number(rotation[2] || 0) * (Math.PI / 180)
      )

      onUpdateTransform({
        id,
        type: 'scale',
        value: [scaleFactor, scaleFactor, scaleFactor]
      })
    }
  }, [modelDimensions, roomDimensions, position, rotation, scale, id, name, onUpdateTransform])

  useFrame(() => {
    if (groupRef.current && isSelected) {
      const newPosition = groupRef.current.position.toArray() as [number, number, number]
      const newRotation = groupRef.current.rotation.toArray().slice(0, 3).map(r => Number(r || 0) * (180 / Math.PI)) as [number, number, number]
      const newScale = groupRef.current.scale.toArray() as [number, number, number]

      // Apply constraints based on category
      if (category === 'lightings') {
        newPosition[1] = roomDimensions.height - modelDimensions.y / 4.2 // Stick to ceiling
        newPosition[0] = Math.max(-roomDimensions.width / 2, Math.min(roomDimensions.width / 2, newPosition[0])) // Constrain X
        newPosition[2] = Math.max(-roomDimensions.length / 2, Math.min(roomDimensions.length / 2, newPosition[2])) // Constrain Z
      } else if (category === 'doors') {
        // Snap to nearest wall
        const snapThreshold = 1 // Adjust as needed
        if (Math.abs(newPosition[0]) > Math.abs(newPosition[2])) {
          newPosition[0] = Math.sign(newPosition[0]) * (roomDimensions.width / 2 - modelDimensions.x / 2)
          newPosition[2] = Math.max(-roomDimensions.length / 2, Math.min(roomDimensions.length / 2, newPosition[2]))
        } else {
          newPosition[2] = Math.sign(newPosition[2]) * (roomDimensions.length / 2 - modelDimensions.z / 2)
          newPosition[0] = Math.max(-roomDimensions.width  / 2, Math.min(roomDimensions.width / 2, newPosition[0]))
        }
        newPosition[1] = 0 // Place on floor
      }

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