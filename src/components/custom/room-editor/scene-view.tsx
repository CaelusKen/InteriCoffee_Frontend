'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { OrbitControls, PivotControls, TransformControls, Grid, Environment, Sky, Stats } from '@react-three/drei'
import { Furniture, Room, TransformUpdate } from '@/types/room-editor'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
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

interface PivotControlsWrapperProps {
    children: ReactNode;
    visible?: boolean;
    anchor?: [number, number, number];
    onDrag?: (matrix: THREE.Matrix4) => void;
    scale?: number;
    depthTest?: boolean;
    fixed?: boolean;
    lineWidth?: number;
  }
  
function PivotControlsWrapper({ children, ...props }: PivotControlsWrapperProps) {
    const { camera } = useThree()
    return <PivotControls scale={75} depthTest={false} fixed lineWidth={2} {...props}>{children}</PivotControls>
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

    useEffect(() => {
        if (selectedItem !== null) {
        const object = furniture.find(item => item.id === selectedItem)
        if (object) {
            setSelectedObject(new THREE.Object3D())
        } else {
            setSelectedObject(null)
        }
        } else {
        setSelectedObject(null)
        }
    }, [selectedItem, furniture])

    const handleTransformChange = (matrix: THREE.Matrix4) => {
        if (selectedObject && selectedItem !== null) {
        const position = new THREE.Vector3()
        const rotation = new THREE.Euler()
        const scale = new THREE.Vector3()
        matrix.decompose(position, new THREE.Quaternion(), scale)
        rotation.setFromRotationMatrix(matrix)

        onUpdateTransform({
            id: selectedItem,
            type: 'position',
            value: position.toArray() as [number, number, number]
        })
        onUpdateTransform({
            id: selectedItem,
            type: 'rotation',
            value: rotation.toArray().slice(0, 3) as [number, number, number]
        })
        onUpdateTransform({
            id: selectedItem,
            type: 'scale',
            value: scale.toArray() as [number, number, number]
        })
        }
    }

    return (
        <>
        <RoomComponent {...room} />
        {furniture.map((item) => (
            <group key={item.id}>
            <FurnitureItem
                {...item}
                onSelect={() => onSelectItem(item.id)}
                isSelected={selectedItem === item.id}
            />
            {selectedItem === item.id && selectedObject && (
                <PivotControlsWrapper
                    visible={transformMode !== 'scale'}
                    anchor={[0, 0, 0]}
                    onDrag={(matrix: THREE.Matrix4) => {
                        handleTransformChange(matrix)
                    }}
                    scale={75}
                    depthTest={false}
                    fixed
                    lineWidth={2}
                >
                <primitive object={selectedObject} position={item.position} rotation={item.rotation} scale={item.scale} />
                </PivotControlsWrapper>
            )}
            </group>
        ))}
        <OrbitControls makeDefault />
        <Grid infiniteGrid />
        <Environment preset="apartment" />
        <Sky />
        <Stats />
        </>
    )
}