import React from 'react'
import { Box } from '@react-three/drei'
import { Room } from '@/types/room-editor'
import * as THREE from 'three'

interface RoomComponentProps extends Room {
  wallTexture: THREE.Texture
}

export default function RoomComponent({ width, length, height, wallTexture }: RoomComponentProps) {
  return (
    <Box args={[width, height, length]} position={[0, height / 2, 0]}>
      <meshStandardMaterial color="#FFFFFF" map={wallTexture} side={1} transparent />
    </Box>
  )
}