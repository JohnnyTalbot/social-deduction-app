import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import { ref, update, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Player, Room } from '@/types/game';
import { flushSync } from 'react-dom';

export function useRoomSync(roomId: string) {
  const router = useRouter();
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

  const handleKickPlayer = (playerToKick: Player) => {
    if (!roomData || !playerToKick?.seatNumber) return;
    if (!Array.isArray(roomData.seats)) return null;
  
    // Remove from seat
    const updatedSeats = roomData?.seats.map(seat => {
      if (seat.playerId === playerToKick.id) {
        return { ...seat, playerId: '', isTaken: false };
      }
      return seat;
    });
    
    flushSync(() => {
      updateRoomData({ seats: updatedSeats });
    })
    
    // Update player info
    updatePlayerById(playerToKick.id, {
      isSeated: false,
      wasKicked: true
    });
  }

  const updateVotingData = (partialOrUpdater: Partial<Room["votingData"]> | ((prev: Room["votingData"]) => Partial<Room["votingData"]>)) => {
    const current = roomData?.votingData || {};
    const partial = typeof partialOrUpdater === 'function' ? partialOrUpdater(current) : partialOrUpdater;
    updateRoomData({
      votingData: {
        ...current,
        ...partial,
      }
    });
  }



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

  useEffect(() => {
    if (playerData?.wasKicked) {
      alert("You were removed from the game.");
      router.push('/join')
    }
  }, [playerData]);

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

  // Listen for current player data changes
  useEffect(() => {
    if (!roomId || !playerData?.id) return;

    const playerRef = ref(db, `rooms/${roomId}/players/${playerData.id}`);
    const unsubscribePlayer = onValue(playerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayerData((prev) => prev ? { ...prev, ...data } : prev);
      }
    });

    return () => off(playerRef, 'value', unsubscribePlayer);
  }, [roomId, playerData?.id]);




  return {
    roomData,
    playerData,
    setRoomData,
    setPlayerData,
    updateRoomData,
    updatePlayerData,
    updatePlayerById,
    updateVotingData,
    handleKickPlayer
  };
}
