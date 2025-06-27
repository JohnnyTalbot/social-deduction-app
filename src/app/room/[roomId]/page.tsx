"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { get, ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Room, Player } from "@/types/game";
import { useRoomSync } from "@/hooks/useRoomSync";
import { usePresence } from "@/hooks/usePresence";

import ModelPreload from '@/components/ModelPreload';
import PresenceWatcher from "./PresenceWatcher";
import GameArea from "./GameArea";
import { Card, CardSide } from "@/components/ui/Card";
import Loading from "@/components/Loading";
import ChatBox from "@/components/ChatBox";

function RoomPage() {
  const router = useRouter();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const {
    roomData,
    playerData,
    setRoomData,
    setPlayerData,
    updateRoomData,
    updatePlayerData
  } = useRoomSync(roomId as string);

  useEffect(() => {
    if (!roomId) {
      router.push("/join");
      return;
    }

    const localRoomId = localStorage.getItem("roomId");
    const uuid = localStorage.getItem("uuid");
    if (!uuid || (localRoomId && localRoomId !== roomId)) {
      router.push("/join");
      return;
    }

    const fetchInitialData = async () => {
      try {
        const roomSnap = await get(ref(db, `rooms/${roomId}`));
        if (roomSnap.exists()) setRoomData(roomSnap.val());

        const playerSnap = await get(ref(db, `rooms/${roomId}/players/${uuid}`));
        if (playerSnap.exists()) {
          setPlayerData(playerSnap.val());
        }
      } catch (err) {
        console.error("Error fetching room/player:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [roomId]);

  usePresence(roomId as string, playerData?.id || "", playerData);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      {playerData?.isStoryteller && <PresenceWatcher roomId={roomId as string} />}
      <ModelPreload />
      <GameArea
        roomData={roomData}
        playerData={playerData}
        updateRoomData={updateRoomData}
        updatePlayerData={updatePlayerData}
      />
      {playerData && roomData && (
        <>
          <h1 className="text-5xl absolute top-0">Room Code: {roomId}</h1>
          <div>
            <p>{playerData.name}</p>
            <p>
              {playerData.isStoryteller
                ? "(Storyteller)"
                : playerData.isSeated
                ? "(Player)"
                : "(Spectator)"}
            </p>
          </div>
          <CardSide 
            icon={<svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.25 0C2.35051 0 0 2.29237 0 5.12016V22.1874C0 25.0152 2.35051 27.3075 5.25 27.3075H18.8125L26.9068 33.6228C28.0526 34.5168 29.75 33.7212 29.75 32.2901V27.3075H30.6514C33.0531 27.3075 35 25.4088 35 23.0665V5.12016C35 2.29237 32.6495 0 29.75 0H5.25Z" fill="#51277D"/>
                  </svg>}
                  >
            <ChatBox roomId={roomData.id} player={playerData} />
          </CardSide>
          
          <div className="absolute right-0 p-2 border-white border-2">
            {roomData.players &&
              Object.values(roomData.players)
                .filter((player) => player.state === "online")
                .map((player) => (
                  <div key={player.id} className="text-white">
                    {player.name}{" "}
                    {player.isStoryteller
                      ? "(Storyteller)"
                      : player.isSeated
                      ? "(Player)"
                      : "(Spectator)"}
                  </div>
                ))}
          </div>
        </>
      )}
    </div>
  );
}

export default RoomPage;
