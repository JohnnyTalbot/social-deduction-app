import { useEffect } from 'react';
import { ref, onValue, off, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Player } from '@/types/game';

export function usePresenceWatcher(roomId: string) {
  useEffect(() => {
    if (!roomId) return;

    const playersRef = ref(db, `rooms/${roomId}/players`);

    const unsubscribe = onValue(playersRef, (snapshot) => {
      const players = snapshot.val();
      if (!players) return;

      Object.entries(players).forEach(([playerId, playerData]) => {
        const player = playerData as Player & {
          presence?: Record<string, true>;
        };

        const presence = player.presence ?? {};
        const isOnline = Object.keys(presence).length > 0;

        // If player is offline, update their state and unseat them
        if (!isOnline && player.state !== 'offline') {
          const updates: Record<string, any> = {
            [`rooms/${roomId}/players/${playerId}/state`]: 'offline',
            [`rooms/${roomId}/players/${playerId}/last_changed`]: Date.now(),
          };

          // Also handle unseating
          if (player.seatNumber != null && player.seatNumber !== undefined) {
            const seatIndex = player.seatNumber - 1;

            updates[`rooms/${roomId}/players/${playerId}/isSeated`] = false;
            updates[`rooms/${roomId}/players/${playerId}/seatNumber`] = null;
            updates[`rooms/${roomId}/seats/${seatIndex}/isTaken`] = false;
            updates[`rooms/${roomId}/seats/${seatIndex}/playerId`] = '';
          }

          console.log(`🛑 Player ${playerId} is now offline and has been unseated.`);
          update(ref(db), updates);
        }
      });
    });

    return () => {
      off(playersRef, 'value', unsubscribe);
    };
  }, [roomId]);
}
