'use client';

import { usePresenceWatcher } from "@/hooks/usePresenceWatcher";

export default function PresenceWatcher({ roomId }: { roomId: string }) {
  usePresenceWatcher(roomId);
  return null; // No UI, just background logic
}
