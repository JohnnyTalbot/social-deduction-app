import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

export default function ModelPreload() {
  useEffect(() => {
    const models = ['male-a', 'male-b', 'male-c', 'male-d', 'male-e', 'male-f', 'female-a', 'female-b', 'female-c', 'female-d', 'female-e', 'female-f'];
    models.forEach(model => {
      useGLTF.preload(`/models/characters/character-${model}.glb`);
    });
  }, []);

  return null; // This component doesn't render anything
}