import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function CenteredNumber({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.center();
    }
  });

  useFrame(() => {
    if (groupRef.current) {
      const camPos = camera.position.clone();
      const objPos = groupRef.current.getWorldPosition(new THREE.Vector3());
      const target = camPos.clone().setY(objPos.y);
      groupRef.current.lookAt(target);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[3, 3, 3]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}
  
function One() {
  return <CenteredNumber url="/models/kenney/number-1.glb" />;
}
function Two() {
  return <CenteredNumber url="/models/kenney/number-2.glb" />;
}
function Three() {
  return <CenteredNumber url="/models/kenney/number-3.glb" />;
}


export default function Countdown({ countdown }: { countdown: number }) {
  if (countdown <= 0) return null;

  let Component;
  switch (countdown) {
    case 1:
      Component = One;
      break;
    case 2:
      Component = Two;
      break;
    case 3:
      Component = Three;
      break;
    default:
      return null;
  }

  return (
    <group position={[0, 2.5, 0]}>
      <Component />
    </group>
  );
}