import { useEffect, useRef } from 'react';
import { ref, set, onDisconnect, onValue, off, update, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Player } from '@/types/game';

export function usePresence(roomId: string, playerId: string, playerData?: Player) {
  const seatNumberRef = useRef<number | null>(playerData?.seatNumber ?? null);

  // Keep ref in sync with latest seat number
  useEffect(() => {
    seatNumberRef.current = playerData?.seatNumber ?? null;
  }, [playerData?.seatNumber]);

  useEffect(() => {
    if (!roomId || !playerId) return;

    const tabId = crypto.randomUUID();
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    const presenceRef = ref(db, `rooms/${roomId}/players/${playerId}/presence/${tabId}`);
    const allTabsRef = ref(db, `rooms/${roomId}/players/${playerId}/presence`);
    const connectedRef = ref(db, ".info/connected");

    const unsubscribeConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(presenceRef, true).then(() => {
          onDisconnect(presenceRef).remove();
        });
      }
    });

    const unsubscribePresence = onValue(allTabsRef, async (snapshot) => {
      const isOnline = snapshot.exists();
      const updates: Record<string, any> = {
        loadState: isOnline ? "ready" : "offline",
        state: isOnline ? "online" : "offline",
        last_changed: Date.now(),
      };

      // Use ref instead of possibly-stale prop
      const seatNumber = seatNumberRef.current;
      if (!isOnline && seatNumber !== null && seatNumber !== undefined) {
        const seatIndex = seatNumber - 1;
        updates.isSeated = false;
        updates.seatNumber = null;

        await update(ref(db), {
          [`rooms/${roomId}/seats/${seatIndex}/isTaken`]: false,
          [`rooms/${roomId}/seats/${seatIndex}/playerId`]: '',
        });
      }

      await update(playerRef, updates);
    });

    return () => {
      unsubscribeConnected();
      unsubscribePresence();
      remove(presenceRef);
    };
  }, [roomId, playerId]);
}
