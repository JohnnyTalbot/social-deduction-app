"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { ref, set } from 'firebase/database';

import { TextInput, NumberInput } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function CreateRoom() {
  const router = useRouter();

  const [roomData, setRoomData] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("")
  const [playerNumber, setPlayerNumber] = useState(4);


  const generateRoomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const createRoom = async () => {
    try {
      const id = generateRoomId();
      setRoomId(id);
      const roomRef = ref(db, `rooms/${id}`);
      await set(roomRef, {
        storyteller: name,
        playerNumber: playerNumber,
        players: []
      });
      router.push(`/room/${id}`);
    } catch (error) {
      console.error("Firebase set error:", error);
    }
  };
  
  return(
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <div>Create Room</div>
      <TextInput label="Your Name:" onChange={(e) => {setName(e.target.value)}} />
      <NumberInput label="Number of players:" min={4} max={12} onChange={(e) => {setPlayerNumber(parseInt(e.target.value))}} />
      <Button text="Create" onClick={createRoom} />
    </div>
  )
}

export default CreateRoom;