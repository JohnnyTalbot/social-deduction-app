"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { ref, set } from 'firebase/database';
import { Room, Player, Seat } from '@/types/game';

import Link from 'next/link';
import { TextInput } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function CreateRoom() {
  const router = useRouter();

  const [name, setName] = useState("")
  const [isCreating, setIsCreating] = useState(false)


  const generateRoomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const createRoom = async () => {
    setIsCreating(true);
    if (!name) {
      alert("Please enter your name.");
      setIsCreating(false);
      return;
    }
    try {
      const newRoomId = generateRoomId();
      const playerId = crypto.randomUUID();

      // create list of seats
      const seats: Seat[] = Array.from({ length: 12 }, (_, index) => ({
        number: index + 1,
        isTaken: false,
      }));

      const newPlayer: Player = {
        id: playerId,
        name: name,
        isStoryteller: true,
        isSeated: false,
      }
      const newRoom: Room = {
        id: newRoomId,
        storytellerId: newPlayer.id,
        storytellerName: newPlayer.name,
        createdAt: Date.now(),
        status: 'waiting',
        players: {[playerId]: newPlayer},
        seats: seats,
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
      setIsCreating(false);
    }
  };
  
  return(
    <div className='flex flex-row justify-center items-center w-full h-screen'>
      <Link href="/">
        <Button className='absolute top-2 right-2 lg:top-5 lg:right-5 text-2xl lg:text-5xl px-4'>Back</Button>
      </Link>
      <Card className='flex flex-col justify-center items-center gap-5 px-10 py-15 lg:px-18 lg:py-32 '>
        <TextInput 
          className='text-2xl lg:text-5xl'
          onChange={(e) => {setName(e.target.value)}} 
          placeholder="Your Name..."
          />
        {isCreating ?
          <p className='text-center text-2xl lg:text-3xl'>Creating Room...</p>
          :
          <Button 
            className='w-[160px] lg:w-[250px] py-3 lg:py-5'
            onClick={createRoom}
            >
            <p className='text-center text-2xl lg:text-5xl'>Create Room</p>
          </Button>
        }
      </Card>
    </div>
  )
}

export default CreateRoom;