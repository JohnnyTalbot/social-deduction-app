import { useGLTF } from '@react-three/drei';

// Preload all models at the module level
const models = ['male-a', 'male-b', 'male-c', 'male-d', 'male-e', 'male-f', 'female-a', 'female-b', 'female-c', 'female-d', 'female-e', 'female-f'];
models.forEach((model) => {
  useGLTF.preload(`/models/kenney/character-${model}.glb`);
});

export default function ModelPreload() {
  return null;
}
