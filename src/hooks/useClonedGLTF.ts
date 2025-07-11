import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

// Extending the return type of useGLTF to include animations
export function useClonedGLTF(path: string) {
  const { scene, animations } = useGLTF(path);

  const cloned = useMemo(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Object3D;
    return { scene: clone, animations };
  }, [scene, animations]);

  return cloned;
}
