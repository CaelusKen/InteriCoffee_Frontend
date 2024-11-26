import { useRef, useCallback } from 'react'
import * as THREE from 'three'

export function useRaycaster(scene: THREE.Scene, camera: THREE.Camera) {
  const raycaster = useRef(new THREE.Raycaster()).current
  const mouse = useRef(new THREE.Vector2()).current

  const onMouseMove = useCallback((event: MouseEvent) => {
    const canvas = event.target as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }, [mouse])

  const onMouseDown = useCallback((event: MouseEvent) => {
    raycaster.setFromCamera(mouse, camera)
  }, [raycaster, mouse, camera])

  return { raycaster, onMouseMove, onMouseDown }
}