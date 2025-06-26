import { useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

interface CharacterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  model: string;
  name?: string;
}

export default function Character({ position, rotation, model, name }: CharacterProps) {
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

  if (!clonedScene) return null;

  return (
    <group
      ref={characterGroupRef}
      position={position}
      rotation={rotation}
      key={`character-group-${model}-${name}`}
    >
      <primitive object={clonedScene} scale={[3, 3, 3]} />

      {name && (
        <Text
          position={[0, 2.5, 0]}
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