
import { Room, Player, Role } from "@/types/game";

import { Canvas } from '@react-three/fiber';
import Character from "@/components/models/Character";
import { OrbitControls } from "@react-three/drei";
import { flushSync } from 'react-dom';

import Button from "@/components/ui/Button";

interface SelectedCharacterProps{
  selectedCharacter?: Player;
  updateRoomData: (partial: Partial<Room>) => void;
  updatePlayerById: (playerId: string, partial: Partial<Player>) => void;
}

function SelectedCharacter({selectedCharacter, updateRoomData, updatePlayerById} : SelectedCharacterProps){
  return(
    <div className="w-full h-full flex flex-row gap-5">
      <div className="flex flex-col justify-center items-center w-[400px] h-[500px]">
        <Canvas 
          className='w-[400px] h-[400px]' 
          camera={{ position: [0, 15, 0], fov: 15 }}
        >
          <ambientLight intensity={1} />
          <Character 
            position={[0, 0, 0]} 
            rotation={[0, 0, 0]} 
            playerData={selectedCharacter}
            model={selectedCharacter?.model || 'male-a'} />
          <OrbitControls 
            target={[0, 1, 0]}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
      <div className="flex flex-col justify-center items-center w-[400px] h-[500px]">
        <Button
          onClick={() => {
            if (!selectedCharacter) return;

            flushSync(() => {
              updateRoomData({
                currentNominated: selectedCharacter.id,
              });
            });

            updatePlayerById(selectedCharacter.id, {
              currentAnimation: 'die',
              isAnimating: true,
            });
          }}
        >
          Nominate Player
        </Button>
      </div>
    </div>
  )
}

export default SelectedCharacter;