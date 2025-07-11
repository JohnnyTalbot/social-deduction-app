import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { Room, Player, Seat } from '@/types/game';

import Plus from '@/components/models/Plus';
import Character from '@/components/models/Character';
import Table from '@/components/models/Table';

interface GameAreaProps {
  roomData: Room | unknown;
  playerData: Player | unknown;
  updatePlayerData: (partial: Partial<Player>) => void;
  updateRoomData: (partial: Partial<Room>) => void;
  setSelectedCharacter: (character: Player) => void;
  setOpenCharacter: (open: boolean) => void;
}

function GameArea({ roomData, playerData, updatePlayerData, updateRoomData, setSelectedCharacter, setOpenCharacter }: GameAreaProps) {
  const radius = 5;
  const center = new THREE.Vector3(0, 1.2, 0);
  const count = 12; // number of objects in the circle
  const angleOffset = 0; // rotate the entire circle if needed

  if (!playerData || !roomData) return;

  const player =  playerData as Player;
  const room = roomData as Room;

  const handleSeatedClick = (seat: Seat) => {

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

  if (!roomData || !playerData) return null;

  return (
    <Canvas camera={{ position: [-5, 4, 4] }}>
      <ambientLight intensity={room.currentPhase != "night" ? 0.5 : 0.2} />
      {room.currentPhase != "night" && <directionalLight color={"yellow"} position={[0, 20, 0]} />}
      <Table />
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
        const CharacterRotationY = Math.atan2(lookAtVector.x, lookAtVector.z)
        const PlusRotationY = Math.atan2(lookAtVector.x, lookAtVector.z) + Math.PI / 2;

        return (
          seat.isTaken ?
          <Character
            key={`seat-${seat.number}`}
            position={[x, 0, z]}
            rotation={[0, CharacterRotationY, 0]}
            model={(roomData as Room).players[seat.playerId || '']?.model || 'male-a'}
            name={(roomData as Room).players[seat.playerId || '']?.name || `Player ${seat.number}`}
            playerData={(roomData as Room).players[seat.playerId || '']}
            setSelectedCharacter={setSelectedCharacter}
            setOpenCharacter={setOpenCharacter}
          />
          :
          <Plus
            key={`seat-${seat.number}`}
            position={[x, y, z]}
            rotation={[0, PlusRotationY, 0]}
            onClick={() => {
              handleSeatedClick(seat)
              document.body.style.cursor = 'default'
            }}
          />
        )
      })}
    </Canvas>
  );
}

export default GameArea;