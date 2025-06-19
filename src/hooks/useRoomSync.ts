import { useEffect, useRef, useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Player, Room } from '@/types/game';

export function useRoomSync(roomId: string) {
  const [roomData, setRoomData] = useState<Room>();
  const [playerData, setPlayerData] = useState<Player>();

  const isLocalRoomUpdate = useRef(false);
  const isLocalPlayerUpdate = useRef(false);

  const updateRoomData = (partial: Partial<Room>) => {
    if (!roomData) return;
    isLocalRoomUpdate.current = true;
    setRoomData({ ...roomData, ...partial });
  };

  const updatePlayerData = (partial: Partial<Player>) => {
    if (!playerData) return;
    isLocalPlayerUpdate.current = true;
    setPlayerData({ ...playerData, ...partial });
  };

  useEffect(() => {
    if (!roomData || !isLocalRoomUpdate.current) return;
    update(ref(db, `rooms/${roomId}`), roomData);
    isLocalRoomUpdate.current = false;
  }, [roomData]);

  useEffect(() => {
    if (!playerData || !roomId || !isLocalPlayerUpdate.current) return;
    update(ref(db, `rooms/${roomId}/players/${playerData.id}`), playerData);
    isLocalPlayerUpdate.current = false;
  }, [playerData, roomId]);

  return {
    roomData,
    playerData,
    setRoomData,
    setPlayerData,
    updateRoomData,
    updatePlayerData
  };
}
