import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { SkeletonUtils } from 'three-stdlib';

import { useClonedGLTF } from '@/hooks/useClonedGLTF';
import { useCharacterAnimator } from '@/hooks/useCharacterAnimator';

import { Player, Room } from '@/types/game';
import { update } from 'firebase/database';

interface CharacterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  model: string;
  name?: string;
  playerData?: Player;
  updatePlayerById?: (playerId: string, partial: Partial<Player>) => void;
  roomData?: Room;
  setSelectedCharacter?: (character: Player) => void;
  setOpenCharacter?: (open: boolean) => void;
}

export default function Character({ position, rotation, model, name, playerData, updatePlayerById, roomData, setSelectedCharacter, setOpenCharacter }: CharacterProps) {
  const modelPath = `/models/kenney/character-${model}.glb`;

  const [charHover, setCharHover] = useState(false)

  const { scene: clonedScene, animations } = useClonedGLTF(modelPath);

  const characterGroupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Object3D | null>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const camera = useThree((state) => state.camera);
  const [isSceneReady, setIsSceneReady] = useState(false);

  const { playAnimation } = useCharacterAnimator(clonedScene, animations, playerData?.id, updatePlayerById);

  useEffect(() => {
    if (clonedScene) {
      setIsSceneReady(true);
    }
  }, [clonedScene]);

  useEffect(() => {
    playAnimation('idle', {fadeDuration: 1});
  }, [playAnimation]);

  const lastAnimationRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSceneReady || !playerData?.isAnimating || !playerData.currentAnimation) return;
    if (playerData?.isVoting) return;

    console.log("playerData.isVoting:", playerData.isVoting);

    // Optional: prevent triggering same animation repeatedly
    // if (lastAnimationRef.current === playerData.currentAnimation) return;
    lastAnimationRef.current = playerData.currentAnimation;

    playAnimation(playerData.currentAnimation, { loopOnce: true });
  }, [playerData?.isAnimating, playerData?.currentAnimation, playAnimation, isSceneReady]);


  // isVoting arm raised:
  useLayoutEffect(() => {
    if (!clonedScene || !characterGroupRef.current) {
        armRef.current = null; // Clear armRef if not ready
        return;
    }
    const foundArm = clonedScene.getObjectByName('arm-left'); // Search on the cloned object directly

    if (foundArm) {
      armRef.current = foundArm;
    } else {
      armRef.current = null;
    }
  }, [clonedScene]);

  useFrame(() => {
    if (!armRef.current || !playerData) return;

    if (playerData.isVoting) {
      // Raise arm statically — adjust axis/values based on model orientation
      armRef.current.rotation.x = -Math.PI / 2;
      armRef.current.rotation.y = 0;
      armRef.current.rotation.z = 0;
    }
  });


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
      <primitive 
        onPointerOver={() => setCharHover(true)}
        onPointerOut={() => setCharHover(false)}
        onClick={() => {
          if(setSelectedCharacter && setOpenCharacter && playerData){
            setSelectedCharacter(playerData)
            setOpenCharacter(true)
            setCharHover(false)
            playAnimation('emote-yes', {loopOnce: true, fadeDuration: 2})
          }
        }} 
        object={clonedScene} 
        position={[0, 0, 0]} 
        scale={[3, 3, 3]} />

      
      {playerData && <Highlight visible={charHover} />}

      {playerData && roomData?.votingData && playerData?.id == roomData?.votingData?.currentNominated && <Banner />}

      {name && (
        <Text
          ref={textRef}
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
      {
        playerData && playerData.role && (
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
    <mesh ref={meshRef} position={[0, 3.5, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function Highlight({visible=false}) {
  const { scene: clonedScene } = useClonedGLTF(`/models/kenney/indicator-square-b.glb`);

  return <primitive visible={visible} object={clonedScene} scale={[1.2, 1.2, 1.2]} />;
}

function Banner() {
  const { scene: clonedScene } = useClonedGLTF(`/models/kenney/banner.glb`);

  return (
    <primitive
      object={clonedScene}
      position={[0, 1, 1.7]}
      scale={[2, 2, 2]}
    />
  );
}

