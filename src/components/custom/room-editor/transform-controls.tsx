'use effect'

import React, { useRef, useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { TransformControls } from '@react-three/drei'

// Define the correct type for the TransformControls ref using `typeof TransformControls`
interface CustomTransformControlsProps {
  object: THREE.Object3D
  mode: 'translate' | 'rotate' | 'scale'
  onObjectChange: () => void
}

const CustomTransformControls: React.FC<CustomTransformControlsProps> = ({ object, mode, onObjectChange }) => {
  const { camera, gl } = useThree()  // `camera` is inferred from `useThree()`
  const transformRef = useRef<typeof TransformControls>(null)  // Use `typeof TransformControls`

  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    if (transformRef.current) {
        // @ts-expect-error: any
      transformRef.current.setMode(mode)
      // @ts-expect-error: any
      transformRef.current.attach(object)
    }
  }, [object, mode])

  const createArrow = (color: string, axis: [number, number, number]) => {
    const arrowGeometry = new THREE.ConeGeometry(0.1, 0.5, 32)
    const material = new THREE.MeshBasicMaterial({ color: color })
    const arrow = new THREE.Mesh(arrowGeometry, material)
    arrow.position.set(...axis)
    arrow.lookAt(new THREE.Vector3(...axis).multiplyScalar(2))
    return arrow
  }

  const handlePointerOver = (axis: string) => () => setHovered(axis)
  const handlePointerOut = () => setHovered(null)

  return (
    <group>
      {/* Correct type usage for TransformControls */}
      <TransformControls
        // @ts-expect-error: any
        ref={transformRef}  // The ref is properly typed now
        // @ts-expect-error: any
        args={[camera as THREE.Camera, gl.domElement as HTMLCanvasElement]}  // Ensure proper typecasting
        onObjectChange={onObjectChange}
      />
      {mode === 'translate' && (
        <>
          <primitive object={createArrow('#ff0000', [1, 0, 0])} onPointerOver={handlePointerOver('x')} onPointerOut={handlePointerOut} />
          <primitive object={createArrow('#00ff00', [0, 1, 0])} onPointerOver={handlePointerOver('y')} onPointerOut={handlePointerOut} />
          <primitive object={createArrow('#0000ff', [0, 0, 1])} onPointerOver={handlePointerOver('z')} onPointerOut={handlePointerOut} />
        </>
      )}
      {mode === 'rotate' && (
        <>
          <mesh onPointerOver={handlePointerOver('x')} onPointerOut={handlePointerOut}>
            <torusGeometry args={[1, 0.02, 16, 100]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          <mesh onPointerOver={handlePointerOver('y')} onPointerOut={handlePointerOut} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.02, 16, 100]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
          <mesh onPointerOver={handlePointerOver('z')} onPointerOut={handlePointerOut} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1, 0.02, 16, 100]} />
            <meshBasicMaterial color="#0000ff" />
          </mesh>
        </>
      )}
      {hovered && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color={hovered === 'x' ? '#ff0000' : hovered === 'y' ? '#00ff00' : '#0000ff'} />
        </mesh>
      )}
    </group>
  )
}

export default CustomTransformControls
