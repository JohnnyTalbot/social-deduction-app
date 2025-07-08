import { useEffect, useRef, useState } from 'react';
import { ref, update, onValue, off } from 'firebase/database';
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

  const updatePlayerById = (playerId: string, partial: Partial<Player>) => {
    if (!roomId || !playerId) return;

    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    update(playerRef, partial);
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

  // Listen for room data changes
  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribePlayers = onValue(roomRef, (snapshot) => {
      const room = snapshot.val();
      if (room) {
        setRoomData((prev) => prev ? { ...prev, ...room } : prev);
      }
    });

    return () => off(roomRef, 'value', unsubscribePlayers);
  }, [roomId]);



  return {
    roomData,
    playerData,
    setRoomData,
    setPlayerData,
    updateRoomData,
    updatePlayerData,
    updatePlayerById
  };
}
