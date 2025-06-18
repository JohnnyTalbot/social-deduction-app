"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ref, push, onValue, set, update, get, onDisconnect } from 'firebase/database';
import { db } from '@/lib/firebase';

import { Room, Player } from '@/types/game';

import GameArea from './GameArea';
import Loading from '@/components/Loading';
import ChatBox from '@/components/ChatBox';


function RoomPage() {
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<Room>();
  const [playerData, setPlayerData] = useState<Player>();

  const isLocalRoomUpdate = useRef(false);
  const isLocalPlayerUpdate = useRef(false);


  // get update changes on db
  useEffect(() => {
    if (!roomId) return;

    const fetchRoomAndPlayer = async () => {
      const uuid = localStorage.getItem("uuid");
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

          setLoading(false);
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

  // Update Firebase whenever local roomData changes
  useEffect(() => {
    if (!roomData || !isLocalRoomUpdate.current) return;

    const roomRef = ref(db, `rooms/${roomData.id}`);
    update(roomRef, roomData);
    isLocalRoomUpdate.current = false;
  }, [roomData]);

  // Update Firebase whenever local playerData changes
  useEffect(() => {
    if (!playerData || !roomId || !isLocalPlayerUpdate.current) return;

    const playerRef = ref(db, `rooms/${roomId}/players/${playerData.id}`);
    update(playerRef, playerData);
    isLocalPlayerUpdate.current = false;
  }, [playerData, roomId]);

  // Handle player data updates
  const updatePlayerData = (partial: Partial<Player>) => {
    if (!playerData) return;

    const updatedPlayer = {
      ...playerData,
      ...partial,
    };

    isLocalPlayerUpdate.current = true;
    setPlayerData(updatedPlayer);
  };


  // Handle room data updates
  const updateRoomData = (partial: Partial<Room>) => {
    if (!roomData) return;

    const updatedRoom = {
      ...roomData,
      ...partial,
    };

    isLocalRoomUpdate.current = true;
    setRoomData(updatedRoom);
  };

  if (loading) {
    return <Loading />;
  }
  return(
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <GameArea 
        roomData={roomData} 
        playerData={playerData} 
        updatePlayerData={updatePlayerData} 
        updateRoomData={updateRoomData} 
      />
      {
        playerData && roomData ?
        <>
          <h1 className='absolute top-0'>Room Code: {roomId}</h1>
          <p>{playerData.name}</p>
          <p>{playerData.isStoryteller ? '(Storyteller)' : playerData.isSeated ? '(Player)' : '(Spectator)'}</p>
          <ChatBox roomId={roomData.id} player={playerData} />
          <div className='absolute right-0 p-2 border-white border-2'>
            {roomData.players &&
              Object.values(roomData.players)
              .filter((player) => player.state === 'online')
              .map((player) => (
                <div key={player.id} className="text-white">
                  {player.name} {player.isStoryteller ? '(Storyteller)' : player.isSeated ? '(Player)' : '(Spectator)'}
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