import React from 'react'
import { Box } from '@react-three/drei'
import { Room } from '@/types/room-editor'

export default function RoomComponent({ width, length, height }: Room) {
  return (
    <Box args={[width, height, length]} position={[0, height / 2, 0]}>
      <meshStandardMaterial color="#FFFFFF" side={1} transparent />
    </Box>
  )
}