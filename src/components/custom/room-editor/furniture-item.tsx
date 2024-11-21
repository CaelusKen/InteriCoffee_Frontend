import React, { useRef, useEffect, useState } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { Furniture } from '@/types/room-editor'
import * as THREE from 'three'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const [localRotation, setLocalRotation] = useState<[number, number, number]>(rotation)

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
      
      groupRef.current.scale.set(...scale)
      groupRef.current.position.set(...position)
      groupRef.current.rotation.set(
        Number(localRotation[0] || 0) * (Math.PI / 180),
        Number(localRotation[1] || 0) * (Math.PI / 180),
        Number(localRotation[2] || 0) * (Math.PI / 180)
      )

      onUpdateTransform({
        id,
        type: 'scale',
        value: [scaleFactor, scaleFactor, scaleFactor]
      })
    }
  }, [modelDimensions, roomDimensions, position, localRotation, scale, id, name, onUpdateTransform])

  useFrame(() => {
    if (groupRef.current && isSelected) {
      const newPosition = groupRef.current.position.toArray() as [number, number, number]
      const newRotation = groupRef.current.rotation.toArray().slice(0, 3).map(r => {
        const degrees = ((r as number) * (180 / Math.PI)) % 360;
        return Number(degrees.toFixed(2));
      }) as [number, number, number]
      const newScale = groupRef.current.scale.toArray() as [number, number, number]

      if (category.find((category) => category.match('Lightings'))) {
        newPosition[1] = roomDimensions.height - modelDimensions.y / 4.2
        newPosition[0] = Math.max(-roomDimensions.width / 2, Math.min(roomDimensions.width / 2, newPosition[0]))
        newPosition[2] = Math.max(-roomDimensions.length / 2, Math.min(roomDimensions.length / 2, newPosition[2]))
      } else if (category.find((category) => category.match('Doors and Windows'))) {
        const snapThreshold = 1
        if (Math.abs(newPosition[0]) > Math.abs(newPosition[2])) {
          newPosition[0] = Math.sign(newPosition[0]) * (roomDimensions.width / 2 - modelDimensions.x / 2)
          newPosition[2] = Math.max(-roomDimensions.length / 2, Math.min(roomDimensions.length / 2, newPosition[2]))
        } else {
          newPosition[2] = Math.sign(newPosition[2]) * (roomDimensions.length / 2 - modelDimensions.z / 2)
          newPosition[0] = Math.max(-roomDimensions.width  / 2, Math.min(roomDimensions.width / 2, newPosition[0]))
        }
        newPosition[1] = 0
      }

      if (!arraysEqual(newPosition, position)) {
        onUpdateTransform({ id, type: 'position', value: newPosition })
      }
      if (!arraysEqual(newRotation, localRotation)) {
        setLocalRotation(newRotation)
        onUpdateTransform({ id, type: 'rotation', value: newRotation })
      }
      if (!arraysEqual(newScale, scale)) {
        onUpdateTransform({ id, type: 'scale', value: newScale })
      }
    }
  })


  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(event);
  }

  const handleRotationChange = (axis: number, value: string) => {
    const newRotation = [...localRotation] as [number, number, number]
    newRotation[axis] = Number(value) % 360
    setLocalRotation(newRotation)
    onUpdateTransform({ id, type: 'rotation', value: newRotation })
  }

  return (
    <group 
      ref={groupRef}
      name={`furniture-${id}`}
      onClick={handleClick}
      position={position}
      rotation={localRotation.map(r => r * (Math.PI / 180)) as [number, number, number]}
      scale={scale}
    >
      <primitive object={scene.clone()} />
      {/* {isSelected && (
        <Html>
          <div className="bg-white p-2 rounded shadow-md">
            <Label>Rotation</Label>
            <div className="flex space-x-2">
              {['X', 'Y', 'Z'].map((axis, index) => (
                <Input
                  key={axis}
                  type="number"
                  value={localRotation[index].toFixed(2)}
                  onChange={(e) => handleRotationChange(index, e.target.value)}
                  className="w-20"
                  min="0"
                  max="360"
                  step="0.1"
                />
              ))}
            </div>
          </div>
        </Html>
      )} */}
    </group>
  )
}

function arraysEqual(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) < 0.0001);
}