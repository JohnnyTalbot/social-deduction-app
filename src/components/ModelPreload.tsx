import { useGLTF } from '@react-three/drei';

// Preload all models at the module level
const models = [
  'character-male-a',
  'character-male-b',
  'character-male-c',
  'character-male-d',
  'character-male-e',
  'character-male-f',
  'character-female-a',
  'character-female-b',
  'character-female-c',
  'character-female-d',
  'character-female-e',
  'character-female-f',
  'character-ghost',
  'number-1',
  'number-2',
  'number-3',
  'indicator-square-b',
  'banner',
];
models.forEach((model) => {
  useGLTF.preload(`/models/kenney/${model}.glb`);
});

export default function ModelPreload() {
  return null;
}
