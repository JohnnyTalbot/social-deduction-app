import { Cylinder, Box } from '@react-three/drei';

export default function Table() {
  return (
    <>
      {/* Round Table Top */}
      <Cylinder args={[4, 4, 0.2, 32]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#8b5e3c" />
      </Cylinder>

      {/* Table Legs */}
      {[
        [2.5, 0.5, 2.5],
        [-2.5, 0.5, 2.5],
        [2.5, 0.5, -2.5],
        [-2.5, 0.5, -2.5],
      ].map(([x, y, z], i) => (
        <Box key={i} args={[0.3, 1, 0.3]} position={[x, y, z]}>
          <meshStandardMaterial color="#5c4033" />
        </Box>
      ))}
    </>
  )
}