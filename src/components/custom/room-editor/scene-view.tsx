'use client'

import React, { useState, useEffect, useRef } from 'react'
import { OrbitControls, Grid, Environment, Sky, Stats } from '@react-three/drei'
import { Furniture, Room, TransformUpdate } from '@/types/room-editor'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { TransformControls as TransformControlsImpl } from 'three/examples/jsm/controls/TransformControls.js'
import FurnitureItem from './furniture-item'
import RoomComponent from './room'
import * as THREE from 'three'

interface SceneViewProps {
  room: Room;
  furniture: Furniture[];
  selectedItem: number | null;
  onSelectItem: (id: number) => void;
  onUpdateTransform: (update: TransformUpdate) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
}

interface TransformControlsWrapperProps {
  object: THREE.Object3D | null;
  mode: 'translate' | 'rotate' | 'scale';
  onObjectChange: () => void;
}

function TransformControlsWrapper({ object, mode, onObjectChange }: TransformControlsWrapperProps) {
  const { camera, gl } = useThree()
  const transformControlsRef = useRef<TransformControlsImpl | null>(null)
  const orbitControlsRef = useRef<OrbitControlsImpl>(null)

  useEffect(() => {
    const controls = transformControlsRef.current
    const orbitControls = orbitControlsRef.current

    if (controls && orbitControls) {
      const callback = (event: any) => {
        if (event.type === 'dragging-changed') {
          // Type assertion to ensure event.value is treated as boolean
          orbitControls.enabled = !(event as unknown as { value: boolean }).value
        }
      }

      controls.addEventListener('dragging-changed', callback)
      return () => controls.removeEventListener('dragging-changed', callback)
    }
  }, [])

  useEffect(() => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(mode)
    }
  }, [mode])

  if (!object) return null

  return (
    <primitive
      ref={transformControlsRef}
      object={new TransformControlsImpl(camera, gl.domElement)}
      attach="transformControls"
      args={[camera, gl.domElement]}
      object3d={object}
      onObjectChange={onObjectChange}
    />
  )
}

export default function SceneView({
  room,
  furniture,
  selectedItem,
  onSelectItem,
  onUpdateTransform,
  transformMode
}: SceneViewProps) {
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null)
  const orbitControlsRef = useRef<OrbitControlsImpl>(null)

  useEffect(() => {
    if (selectedItem !== null) {
      const object = furniture.find(item => item.id === selectedItem)
      if (object) {
        const dummyObject = new THREE.Object3D()
        dummyObject.position.set(...object.position)
        dummyObject.rotation.set(...object.rotation)
        dummyObject.scale.set(...object.scale)
        setSelectedObject(dummyObject)
      } else {
        setSelectedObject(null)
      }
    } else {
      setSelectedObject(null)
    }
  }, [selectedItem, furniture])

  const handleTransformChange = () => {
    if (selectedObject && selectedItem !== null) {
      onUpdateTransform({
        id: selectedItem,
        type: 'position',
        value: selectedObject.position.toArray() as [number, number, number]
      })
      onUpdateTransform({
        id: selectedItem,
        type: 'rotation',
        value: selectedObject.rotation.toArray().slice(0, 3) as [number, number, number]
      })
      onUpdateTransform({
        id: selectedItem,
        type: 'scale',
        value: selectedObject.scale.toArray() as [number, number, number]
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
      <TransformControlsWrapper
        object={selectedObject}
        mode={transformMode}
        onObjectChange={handleTransformChange}
      />
      <OrbitControls ref={orbitControlsRef} makeDefault />
      <Grid infiniteGrid />
      <Environment preset="apartment" />
      <Sky />
      <Stats />
    </>
  )
}
