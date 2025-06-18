import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';

interface CharacterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  model: string; // e.g., "male-a", "female-b"
  name?: string;
}

export default function Character({ position, rotation, model, name }: CharacterProps) {
  const modelPath = `/models/characters/character-${model}.glb`;
  const { scene, nodes } = useGLTF(modelPath);
  const armBone = useRef(nodes["arm-left"]);

  useFrame(() => {
    if (armBone.current) {
      armBone.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <primitive object={scene} scale={3} />

      {name && (
        <Text
          position={[0, 2.5, 0]} // Slightly above the character
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.03}
          outlineColor="black"
        >
          {name}
        </Text>
      )}
    </group>
  );
}
