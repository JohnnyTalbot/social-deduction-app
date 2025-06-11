"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ref, push, onValue, set, update, get, onDisconnect } from 'firebase/database';
import { db } from '@/lib/firebase';

import { Room, Player } from '@/types/game';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Cylinder, Box } from '@react-three/drei';

import ChatBox from '@/components/ChatBox';

import Character from '@/components/models/Character';
import Table from '@/components/models/Table';

function Sphere() {
  return(
    <mesh position={[1.5, 1, 0]}>
      <sphereGeometry args={[0.3, 50, 100]} />
      <meshStandardMaterial color="green" emissive={"green"} />
    </mesh>
  )
}

function Plus() {
  return(
    <>
      <Box args={[0.1, 0.35, 0.1]} position={[4.3, 1.2, 0]}>
        <meshStandardMaterial color="green" emissive="green" />
      </Box>
      <Box args={[0.1, 0.1, 0.35]} position={[4.3, 1.2, 0]}>
        <meshStandardMaterial color="green" emissive="green" />
      </Box>
    </>
  )
}

function RoomPage() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState<Room>();
  const [playerData, setPlayerData] = useState<Player>()
  

  // get update changes on db
  useEffect(() => {
    if (!roomId) return;

    const fetchRoomAndPlayer = async () => {
      const uuid = localStorage.getItem("uuid");
      console.log(uuid)
      try {
        const roomSnap = await get(ref(db, `rooms/${roomId}`));
        if (roomSnap.exists()) {
          setRoomData(roomSnap.val());
        }

        if (uuid) {
          const playerRef = ref(db, `rooms/${roomId}/players/${uuid}`)
          const playerSnap = await get(playerRef);
          if (playerSnap.exists()) {
            const player = playerSnap.val();
            setPlayerData(player);

            onValue(ref(db, ".info/connected"), (snap) => {
              if (snap.val() === false) return;

              update(playerRef, {
                state: "online",
                last_changed: Date.now(),
              });

              onDisconnect(playerRef).update({
                state: "offline",
                last_changed: Date.now(),
              });
            });
          }
        }
      } catch (err) {
        console.error("Error fetching room or player:", err);
      }
    };

    fetchRoomAndPlayer();

    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      setRoomData(snapshot.val());
    });

    return () => unsubscribe();
  }, [roomId]);

  return(
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <h1 className='absolute top-0'>Room Code: {roomId}</h1>
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color={"yellow"} position={[0, 10, 10]} />
        <Table />
        <Plus />
        <Character />
        {/* <Sphere /> */}
        <OrbitControls />
      </Canvas>
      {
        playerData && roomData ?
        <>
          <p>{playerData.name}</p>
          <p>{playerData.isStoryteller ? "Storyteller" : "Player"}</p>
          <ChatBox roomId={roomData.id} player={playerData} />
          <div className='absolute right-0 p-2 border-white border-2'>
            {roomData.players &&
              Object.values(roomData.players).map((player) => (
                <div key={player.id} className="text-white">
                  {player.name} {player.isStoryteller ? '(Storyteller)' : '(Player)'} : {player.state == 'online' ? 'online' : 'offline'}
                </div>
              ))}
          </div>
        </>
        : ""
      }
      
    </div>
  )
};

export default RoomPage;