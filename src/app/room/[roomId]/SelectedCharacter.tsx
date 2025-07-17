
import { Room, Player, Role } from "@/types/game";

import { Canvas } from '@react-three/fiber';
import Character from "@/components/models/Character";
import { OrbitControls } from "@react-three/drei";
import { flushSync } from 'react-dom';

import Button from "@/components/ui/Button";

interface SelectedCharacterProps{
  selectedCharacter?: Player;
  isStoryteller: boolean;
  updateRoomData: (partial: Partial<Room>) => void;
  updateVotingData: (partial: Partial<Room["votingData"]>) => void;
  updatePlayerById: (playerId: string, partial: Partial<Player>) => void;
  handleKickPlayer: (playerToKick: Player) => void;
  setOpenCharacter: (openCharacter: boolean) => void;
}

function SelectedCharacter({selectedCharacter, isStoryteller, updateRoomData, updateVotingData, updatePlayerById, handleKickPlayer, setOpenCharacter} : SelectedCharacterProps){
  return(
    <div className="w-full h-full flex flex-row justify-around items-center gap-2 lg:gap-5">
      <div className="flex flex-col w-[200px] h-[200px] lg:w-[400px] lg:h-[400px]">
        <Canvas 
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
      {
      isStoryteller &&
      <div className="flex flex-col justify-center items-center">
        <Button
          className='px-5 py-3 lg:py-5 lg:px-8'
          onClick={() => {
            if (!selectedCharacter) return;

            handleKickPlayer(selectedCharacter)
            setOpenCharacter(false)
          }}
        >
          <p className='text-xl lg:text-3xl'>Kick Player</p>
        </Button>
      </div>
      }
      {
      !isStoryteller &&
      <div className="flex flex-col justify-center items-center">
        <Button
          className='px-5 py-3 lg:py-5 lg:px-8'
          onClick={() => {
            if (!selectedCharacter) return;

            flushSync(() => {
              updateVotingData({
                phase: "nominations",
                currentNominated: selectedCharacter.id
              });
            });

            updatePlayerById(selectedCharacter.id, {
              currentAnimation: 'die',
              isAnimating: true,
            });
          }}
        >
          <p className='text-xl lg:text-3xl'>Nominate Player</p>
        </Button>
      </div>
      }
    </div>
  )
}


export default SelectedCharacter;