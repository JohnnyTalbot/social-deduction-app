"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { ref, set, serverTimestamp } from 'firebase/database';
import { Room, Player } from '@/types/game';

import { TextInput, NumberInput } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function CreateRoom() {
  const router = useRouter();

  const [name, setName] = useState("")


  const generateRoomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const createRoom = async () => {
    try {
      const newRoomId = generateRoomId();
      const playerId = crypto.randomUUID();

      const newPlayer: Player = {
        id: playerId,
        name: name,
        isStoryteller: true
      }
      const newRoom: Room = {
        id: newRoomId,
        storytellerId: newPlayer.id,
        storytellerName: newPlayer.name,
        createdAt: Date.now(),
        status: 'waiting',
        players: {[playerId]: newPlayer},
        currentRound: 1,
        currentPhase: 'setup'
      }

      const roomRef = ref(db, `rooms/${newRoom.id}`);
      await set(roomRef, newRoom);

      localStorage.setItem('uuid', newPlayer.id)
      localStorage.setItem('name', newPlayer.name)
      localStorage.setItem('role', 'storyteller')
      localStorage.setItem('roomId', newRoom.id)

      router.push(`/room/${newRoom.id}`);
    } catch (error) {
      console.error("Firebase set error:", error);
    }
  };
  
  return(
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <div>Create Room</div>
      <TextInput label="Your Name:" onChange={(e) => {setName(e.target.value)}} />
      <Button text="Create" onClick={createRoom} />
    </div>
  )
}

export default CreateRoom;