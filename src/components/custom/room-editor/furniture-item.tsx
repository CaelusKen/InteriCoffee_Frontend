import React, { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { Furniture } from '@/types/room-editor'
import * as THREE from 'three'
import { useFrame, ThreeEvent } from '@react-three/fiber'

interface FurnitureItemProps extends Furniture {
  onSelect: (event: THREE.Event) => void;
  isSelected: boolean;
  onUpdateTransform: (update: { id: string; type: 'position' | 'rotation' | 'scale'; value: [number, number, number] }) => void;
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
  category,
  material
}: FurnitureItemProps) {
  const { scene } = useGLTF(model)
  const groupRef = useRef<THREE.Group>(null)
  const [modelDimensions, setModelDimensions] = useState<THREE.Vector3>(new THREE.Vector3(DEFAULT_DIMENSION, DEFAULT_DIMENSION, DEFAULT_DIMENSION))

  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current)
      const size = box.getSize(new THREE.Vector3())
      setModelDimensions(size)

      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(material?.color),
            metalness: material?.metalness,
            roughness: material?.roughness,
          })
        }
      })
    }
  }, [model, material])

  useEffect(() => {
    if (groupRef.current && modelDimensions) {
      const maxRoomDimension = Math.max(roomDimensions.width, roomDimensions.length, roomDimensions.height)
      const maxModelDimension = Math.max(modelDimensions.x, modelDimensions.y, modelDimensions.z)
      
      const scaleFactor = (maxRoomDimension * ROOM_SCALE_FACTOR) / maxModelDimension
      
      groupRef.current.position.set(...position)
      groupRef.current?.rotation.set(
        ...rotation.map((deg) => THREE.MathUtils.degToRad(deg)) as [number, number, number]
      );
      groupRef.current.scale.set(...scale)

      onUpdateTransform({
        id,
        type: 'scale',
        value: [scaleFactor, scaleFactor, scaleFactor]
      })
    }
  }, [modelDimensions, roomDimensions, position, rotation, scale, id, onUpdateTransform])

  useFrame(() => {
    if (groupRef.current && isSelected) {
      const worldPosition = new THREE.Vector3()
      const worldQuaternion = new THREE.Quaternion()
      const worldScale = new THREE.Vector3()

      groupRef.current.getWorldPosition(worldPosition)
      groupRef.current.getWorldQuaternion(worldQuaternion)
      groupRef.current.getWorldScale(worldScale)

      const newPosition = worldPosition.toArray()
      const newRotation = new THREE.Euler().setFromQuaternion(worldQuaternion).toArray().map((value) => {
        if (typeof value === 'number') {
          return normalizeAngle(THREE.MathUtils.radToDeg(value))
        }
        return 0
      })
      const newScale = worldScale.toArray()

      if (!arraysEqual(newPosition, position)) {
        onUpdateTransform({ id, type: 'position', value: newPosition as [number, number, number] })
      }
      if (!arraysEqual(newRotation, rotation)) {
        onUpdateTransform({ id, type: 'rotation', value: newRotation as [number, number, number] })
      }
      if (!arraysEqual(newScale, scale)) {
        onUpdateTransform({ id, type: 'scale', value: newScale as [number, number, number] })
      }
    }
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(event);
  }

  return (
    <group 
      ref={groupRef}
      name={`furniture-${id}`}
      onClick={handleClick}
    >
      <primitive object={scene.clone()} />
    </group>
  )
}

function arraysEqual(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) < 0.01);
}

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360 - (angle > 0 && angle % 360 === 0 ? 360 : 0);
}