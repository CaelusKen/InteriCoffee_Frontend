'use client'

import React, { useEffect } from 'react'
import { useThree } from "@react-three/fiber"
import { useGLTF, Center } from "@react-three/drei"
import * as THREE from "three"

export function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const { camera, size } = useThree()
  
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const boxSize = box.getSize(new THREE.Vector3())
    const boxCenter = box.getCenter(new THREE.Vector3())

    const maxSize = Math.max(boxSize.x, boxSize.y, boxSize.z)
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * 50) / 360))
    const fitWidthDistance = fitHeightDistance / (size.width / size.height)
    const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance)

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.near = distance / 100
      camera.far = distance * 100
      camera.updateProjectionMatrix()

      camera.position.set(boxCenter.x, boxCenter.y, boxCenter.z + distance)
      camera.lookAt(boxCenter)
    }
  }, [scene, camera, size])

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}