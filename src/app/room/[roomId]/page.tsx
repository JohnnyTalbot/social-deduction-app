"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

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

function Room() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [role, setRole] = useState('');
  const [name, setName] = useState('')
  

  // get update changes on db
  useEffect(() => {
    if (!roomId) return;

    const roleVal = localStorage.getItem('role') || ""
    const nameVal = localStorage.getItem('name') || ""

    setRole(roleVal) 
    setName(nameVal)

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
        <Character />
        {/* <Sphere /> */}
        <OrbitControls />
      </Canvas>
      {/* <pre>{JSON.stringify(roomData, null, 2)}</pre> */}
      <p>{role}</p>
      <p>{name}</p>

      {roomId && <ChatBox roomId={roomId} name={name} />}
      
    </div>
  )
};

export default Room;