import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

interface CharacterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  model: string; // e.g., "male-a", "female-b"
}

export default function Character({ position, rotation, model }: CharacterProps) {
  const modelPath = `/models/characters/character-${model}.glb`;
  const { scene, nodes } = useGLTF(modelPath);
  const armBone = useRef(nodes["arm-left"]);

  useFrame(() => {
    if (armBone.current) {
      armBone.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.5;
    }
  });

  return (
    <mesh position={position} rotation={rotation}>
      <primitive object={scene} scale={3} />
    </mesh>
  );
}
