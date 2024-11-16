import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

interface ModelViewerProps {
  floor: number
  room: string
}

export default function ModelViewer({ floor, room }: ModelViewerProps) {
  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Placeholder floor={floor} room={room} />
        <OrbitControls />
        <Environment preset="apartment" background />
      </Canvas>
    </div>
  )
}

function Placeholder({ floor, room }: { floor: number; room: string }) {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}