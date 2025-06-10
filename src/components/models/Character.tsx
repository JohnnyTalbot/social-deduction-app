import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

export default function Character() {
  const { scene, nodes } = useGLTF('/models/characters/character-male-a.glb')
  const armBone = useRef(nodes["arm-left"])

  useFrame(() => {
    if (armBone.current) {
      armBone.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.5 // wave motion
    }
  })
  return (
    <mesh position={[0, 0, -4.5]}>
      <primitive object={scene} scale={3} />
    </mesh>
    )
}