import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

import { Room, Player, Seat } from '@/types/game';

import Plus from '@/components/models/Plus';
import Character from '@/components/models/Character';
import Table from '@/components/models/Table';
import { update } from 'firebase/database';

interface GameAreaProps {
  roomData: Room | unknown;
  playerData: Player | unknown;
  updatePlayerData: (partial: Partial<Player>) => void;
  updateRoomData: (partial: Partial<Room>) => void;
}

function GameArea({ roomData, playerData, updatePlayerData, updateRoomData }: GameAreaProps) {
  const radius = 4.3;
  const center = new THREE.Vector3(0, 1.2, 0);
  const count = 12; // number of objects in the circle
  const angleOffset = 0; // rotate the entire circle if needed

  const handleSeatedClick = (seat: Seat) => {
    if (!playerData || !roomData) return;

    const player =  playerData as Player;
    const room = roomData as Room;

    if (player.isStoryteller) {
      alert("Storyteller cannot seat themselves");
      return;
    }
    if (seat.isTaken) {
      // If taken, notify the user
      alert("Seat is already taken");
      return;
    }
    const updatedSeats = room.seats.map((s) => {
      if (s.playerId === player.id) {
        return { ...s, isTaken: false, playerId: '' };
      }
      if (s.number === seat.number) {
        return { ...s, isTaken: true, playerId: player.id };
      }
      return s;
    });
    updateRoomData({
      seats: updatedSeats
    });
    updatePlayerData({ seatNumber: seat.number, isSeated: true });
  };

  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color={"yellow"} position={[0, 10, 10]} />
      <Table />
      {/* <Character position={[0, 0, -4.5]} /> */}
      <OrbitControls />

      {(roomData as Room).seats.map((seat, i) => {
        const angle = (i / count) * Math.PI * 2 + angleOffset

        // Position on the circle
        const x = center.x + radius * Math.cos(angle)
        const z = center.z + radius * Math.sin(angle)
        const y = center.y

        // Rotation: look at the center
        const position = new THREE.Vector3(x, y, z)
        const lookAtVector = new THREE.Vector3().subVectors(center, position)
        const CharacterrotationY = Math.atan2(lookAtVector.x, lookAtVector.z)
        const PlusrotationY = Math.atan2(lookAtVector.x, lookAtVector.z) + Math.PI / 2;

        return (
          seat.isTaken ?
          <Character
            key={seat.playerId || seat.number}
            position={[x, 0, z]}
            rotation={[0, CharacterrotationY, 0]}
            model={seat.number % 2 == 0 ? "male-a" : "female-b"}
          />
          :
          <Plus
            key={i}
            position={[x, y, z]}
            rotation={[0, PlusrotationY, 0]}
            onClick={() => handleSeatedClick(seat)}
          />
        )
      })}
    </Canvas>
  );
}

export default GameArea;