"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

function Room() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);

  // get update changes on db
  useEffect(() => {
    if (!roomId) return;
    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      setRoomData(snapshot.val());
    });
    return () => unsubscribe();
  }, [roomId]);

  return(
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <h1>Room Code: {roomId}</h1>
      <pre>{JSON.stringify(roomData, null, 2)}</pre>
    </div>
  )
};

export default Room;