import { useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { SkeletonUtils } from 'three-stdlib';

import { Player } from '@/types/game';

interface CharacterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  model: string;
  name?: string;
  playerData?: Player;
}

export default function Character({ position, rotation, model, name, playerData }: CharacterProps) {
  const modelPath = `/models/characters/character-${model}.glb`;
  const { scene } = useGLTF(modelPath);

  // SkeletonUtils.clone to create a stable, deep clone
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    const cloned = SkeletonUtils.clone(scene);
    // Important: Reset position/rotation/scale on the cloned object itself
    // as SkeletonUtils.clone might preserve original model transforms.
    cloned.position.set(0, 0, 0);
    cloned.rotation.set(0, 0, 0);
    cloned.scale.set(1, 1, 1); // Reset to 1,1,1 as group will handle overall scale

    return cloned;
  }, [scene, modelPath, name]); // Re-clone only if scene or modelPath changes

  const characterGroupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Object3D | null>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const camera = useThree((state) => state.camera);

  // Use useLayoutEffect for finding the arm, as it relies on the actual mounted object
  // useLayoutEffect(() => {
  //   if (!clonedScene || !characterGroupRef.current) {
  //       armRef.current = null; // Clear armRef if not ready
  //       return;
  //   }
  //   const foundArm = clonedScene.getObjectByName('arm-left'); // Search on the cloned object directly

  //   if (foundArm) {
  //     armRef.current = foundArm;
  //   } else {
  //     armRef.current = null;
  //   }
  // }, [clonedScene, name]);

  // useFrame(() => {
  //   if (armRef.current) {
  //     armRef.current.rotation.z = Math.sin(Date.now() * 0.002) * 0.5;
  //   }
  // });

  // Make text always face the camera
  useFrame(() => {
    if (textRef.current && characterGroupRef.current) {
      const camPos = camera.position.clone();
      const objPos = characterGroupRef.current.getWorldPosition(new THREE.Vector3());

      // Look at the camera but only rotate on Y axis
      const target = camPos.clone().setY(objPos.y); // lock Y
      textRef.current.lookAt(target);
    }
  });


  if (!clonedScene) return null;

  return (
    <group
      ref={characterGroupRef}
      position={position}
      rotation={rotation}
      key={`character-group-${model}-${name}`}
    >
      <primitive object={clonedScene} position={[0, 0, -0.4]} scale={[3, 3, 3]} />

      {name && (
        <Text
          ref={textRef}
          position={[0, 2.5, -0.4]}
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
      {
        playerData && (
          <ImageCard url={`/assets/${playerData.role}.png`} />
        )
      }
    </group>
  );
}

function ImageCard({ url = '', width = 1.5, height = 1.5 }) {
  const texture = useLoader(TextureLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    if (meshRef.current) {
      const camPos = camera.position.clone();
      const objPos = meshRef.current.getWorldPosition(new THREE.Vector3());

      const target = camPos.clone().setY(objPos.y); // lock Y
      meshRef.current.lookAt(target);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 3.5, -0.5]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}
