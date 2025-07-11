import { Box } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

type PlusProps = ThreeElements['mesh'] &  {
  position: [number, number, number];
  rotation: [number, number, number];
}

function Plus({position, rotation, ...props}: PlusProps) {
  return(
    <mesh 
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
      position={position}
      rotation={rotation}
      {...props}
    >
      <Box args={[0.1, 0.35, 0.1]}>
        <meshStandardMaterial color="#6AC26D" />
      </Box>
      <Box args={[0.1, 0.1, 0.35]}>
        <meshStandardMaterial color="#6AC26D" />
      </Box>
    </mesh>
  )
}

export default Plus;