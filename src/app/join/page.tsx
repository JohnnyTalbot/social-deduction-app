"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';

import { Player } from '@/types/game';

import {TextInput} from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function JoinRoom() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("")

  const joinRoom = async () => {
    try {
      const roomRef = ref(db, `rooms/${roomId}`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        alert("Room not found!");
        return;
      }

      const playerId = crypto.randomUUID();
      const newPlayer: Player = {
        id: playerId,
        name: name,
        isStoryteller: false
      }

      const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);

      localStorage.setItem('uuid', newPlayer.id)
      localStorage.setItem('name', newPlayer.name)
      localStorage.setItem('role', 'player')
      localStorage.setItem('roomId', roomId)

      await set(playerRef, newPlayer);
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Firebase joinRoom error:", error);
    }
  };

  return(
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <div>Join Room</div>
      <TextInput label="Your Name:" onChange={(e) => {setName(e.target.value)}} />
      <TextInput label="Room Code:" onChange={(e) => {setRoomId(e.target.value)}} />
      <Button text="Enter" onClick={joinRoom} />
    </div>
  )
}

export default JoinRoom;