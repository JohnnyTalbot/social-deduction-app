import { useEffect } from 'react';
import { ref, set, onDisconnect, onValue, off, update, remove, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Player } from '@/types/game';

export function usePresence(roomId: string, playerId: string, playerData?: Player) {
  useEffect(() => {
    const tabId = crypto.randomUUID();
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    const presenceRef = ref(db, `rooms/${roomId}/players/${playerId}/presence/${tabId}`);
    const allTabsRef = ref(db, `rooms/${roomId}/players/${playerId}/presence`);
    const connectedRef = ref(db, ".info/connected");

    const connectionListener = onValue(connectedRef, (snap) => {
      if (snap.val() === false) return;
      set(presenceRef, true);
      onDisconnect(presenceRef).remove();
    });

    const presenceListener = onValue(allTabsRef, async (snapshot) => {
      const isOnline = snapshot.exists();
      const updates: any = {
        state: isOnline ? "online" : "offline",
        last_changed: Date.now()
      };

      if (!isOnline && playerData?.seatNumber !== undefined) {
        const seatIndex = playerData.seatNumber - 1;
        updates["isSeated"] = false;
        updates["seatNumber"] = null;
        updates[`/rooms/${roomId}/seats/${seatIndex}/isTaken`] = false;
        updates[`/rooms/${roomId}/seats/${seatIndex}/playerId`] = null;
      }

      update(playerRef, updates);
    });

    return () => {
      off(connectedRef, "value", connectionListener);
      off(allTabsRef, "value", presenceListener);
      remove(presenceRef);
    };
  }, [roomId, playerId]);
}
