"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Character from '@/components/models/Character';

import { Player } from '@/types/game';

import Link from 'next/link';
import {TextInput} from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function JoinRoom() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("")
  const [isEntering, setIsEntering] = useState(false);
  const [selectedModel, setSelectedModel] = useState(0)

  // list of models
  const models = ['male-a', 'male-b', 'male-c', 'male-d', 'male-e', 'male-f', 'female-a', 'female-b', 'female-c', 'female-d', 'female-e', 'female-f'];

  const joinRoom = async () => {
    setIsEntering(true);
    if (!name || !roomId) {
      alert("Please enter your name and room code.");
      setIsEntering(false);
      return;
    }
    try {
      const roomRef = ref(db, `rooms/${roomId}`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        setIsEntering(false);
        alert("Room not found!");
        return;
      }

      const playerId = crypto.randomUUID();
      const newPlayer: Player = {
        id: playerId,
        name: name,
        isStoryteller: false,
        isSeated: false,
        model: models[selectedModel],
        loadState: "loading",
        isAlive: true,
        isVoting: false,
        canVote: true,
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
      setIsEntering(false);
    }
  };

  return(
    <div className='flex flex-row gap-5 lg:gap-10 justify-center items-center w-full h-screen'>
      <Link href="/">
        <Button className='absolute top-2 right-2 lg:top-5 lg:right-5 text-2xl lg:text-5xl px-4'>Back</Button>
      </Link>

      <Card className='flex flex-col justify-center items-center w-[200px] h-[260px] lg:w-[400px] lg:h-[500px] gap-5 p-2 lg:p-15 '>
        <h1 className='text-2xl lg:text-5xl'>Select Character</h1>
        <Canvas  
          camera={{ position: [0, 15, 0], fov: 15 }}
        >
          <ambientLight intensity={1} />
          <Character position={[0, 0, 0]} rotation={[0, 0, 0]} model={models[selectedModel]} />
          <OrbitControls 
            target={[0, 1, 0]}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
        <div className='flex flex-row gap-5 justify-center items-center w-full noselect'>
          <svg 
            className='w-[24px] lg:w-[27px] cursor-pointer'
            onClick={() =>
              setSelectedModel((prev) => (prev - 1 < 0 ? models.length - 1 : prev - 1))
            } 
            width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.048 2.561C10.6343 1.97513 10.6343 1.02526 10.048 0.439398C9.46164 -0.146466 8.511 -0.146466 7.92467 0.439397L0.439749 7.91707C-0.146583 8.50293 -0.146583 9.4528 0.439749 10.0387L7.94791 17.5606C8.53424 18.1465 9.48488 18.1465 10.0712 17.5606C10.6575 16.9747 10.6575 16.0249 10.0712 15.439L5.1261 10.4781L25.582 10.4781C26.3651 10.4781 27 9.8064 27 8.97787C27 8.14933 26.3651 7.47767 25.582 7.47767L5.1261 7.47767L10.048 2.561Z" fill="#31154F"/>
          </svg>
          <p className='text-xl lg:text-3xl'>{models[selectedModel]}</p>
          <svg 
            className='w-[24px] lg:w-[27px] cursor-pointer'
            onClick={() =>
              setSelectedModel((prev) => (prev + 1 >= models.length ? 0 : prev + 1))
            } 
            width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.952 15.439C16.3657 16.0249 16.3657 16.9747 16.952 17.5606C17.5384 18.1465 18.489 18.1465 19.0753 17.5606L26.5602 10.0829C27.1466 9.49707 27.1466 8.5472 26.5602 7.96133L19.0521 0.439396C18.4658 -0.146469 17.5151 -0.146468 16.9288 0.439397C16.3425 1.02526 16.3425 1.97513 16.9288 2.56099L21.8739 7.52194L1.41799 7.52194C0.634856 7.52194 8.23548e-07 8.1936 9.15118e-07 9.02214C1.00669e-06 9.85067 0.634856 10.5223 1.41799 10.5223L21.8739 10.5223L16.952 15.439Z" fill="#31154F"/>
          </svg>
        </div>
      </Card>

      <Card className='flex flex-col justify-center items-center w-[260px] h-[260px] lg:w-[500px] lg:h-[500px] gap-5 p-10 lg:p-15 '>
        <TextInput 
          className='text-2xl lg:text-5xl'
          onChange={(e) => {setName(e.target.value)}} 
          placeholder="Your Name..."
          />
        <TextInput 
          className='text-2xl lg:text-5xl'
          onChange={(e) => {setRoomId(e.target.value)}}
          placeholder="Room Code..."
        />
        {isEntering ?
          <p className='text-3xl'>Entering Room...</p>
          :
          <Button 
            className='w-[160px] lg:w-[250px] py-3 lg:py-5'
            onClick={joinRoom}
            >
            <p className='text-2xl lg:text-5xl'>Enter Room</p>
          </Button>
        }
      </Card>
    </div>
  )
}

export default JoinRoom;