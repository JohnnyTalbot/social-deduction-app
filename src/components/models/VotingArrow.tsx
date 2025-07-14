import { useMemo } from 'react'
import * as THREE from 'three'

interface VotingArrowProps {
  targetPosition: [number, number, number];
  length?: number;
  color?: string;
}

export default function VotingArrow({
  targetPosition,
  length = 2.8,
  color = 'red',
}: VotingArrowProps) {
  const rotationY = useMemo(() => {
    const center = new THREE.Vector3(0, 0, 0)
    const target = new THREE.Vector3(...targetPosition)
    const direction = new THREE.Vector3().subVectors(target, center)
    return Math.atan2(direction.x, direction.z)
  }, [targetPosition])

  return (
    <group position={[0, 1.3, 0]} rotation={[0, rotationY, 0]}>
      {/* Shaft of the arrow, rotated from vertical to horizontal (Z axis) */}
      <mesh position={[0, 0, length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, length, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Arrowhead at the tip, also rotated to lie horizontally */}
      <mesh position={[0, 0, length]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 0.4, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}
