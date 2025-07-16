"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { get, ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Room, Player, Role } from "@/types/game";
import { useRoomSync } from "@/hooks/useRoomSync";
import { usePresence } from "@/hooks/usePresence";

import { TroubleBrewing } from "@/data/Scripts";

import ModelPreload from '@/components/ModelPreload';
import PresenceWatcher from "./PresenceWatcher";
import GameArea from "./GameArea";
import PlayerList from "./PlayerList";
import DashboardStoryteller from "./DashboardStoryteller";
import DashboardPlayer from "./DashboardPlayer";
import CharacterSheet from "./CharacterSheet";
import AssignRoles from "./AssignRoles";
import SelectedCharacter from "./SelectedCharacter";


import { Card, CardSide, CardPopup } from "@/components/ui/Card";
import Loading from "@/components/Loading";
import ChatBox from "@/components/ChatBox";

function RoomPage() {
  const router = useRouter();
  const { roomId } = useParams();

  const [loading, setLoading] = useState(true);
  const [openCharacter, setOpenCharacter] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Player>();
  const [openCard, setOpenCard] = useState(0);
  const [openCharReference, setOpenCharReference] = useState(false);
  const [openNightReference, setOpenNightReference] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openAssigns, setOpenAssigns] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [showRoles, setShowRoles] = useState(false);

  const {
    roomData,
    playerData,
    setRoomData,
    setPlayerData,
    updateRoomData,
    updatePlayerData,
    updatePlayerById,
    updateVotingData,
    handleKickPlayer,
    handleStartVote
  } = useRoomSync(roomId as string);

  const seatedPlayers = roomData
    ? Object.values(roomData.players).filter(player => player.isSeated)
    : [];

  const currentPlayer = playerData as Player;


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
        updatePlayerById={updatePlayerById}
        setSelectedCharacter={setSelectedCharacter}
        setOpenCharacter={setOpenCharacter}
        showRoles={showRoles}
      />
      {playerData && roomData && (
        <>
          <div className="flex flex-row justify-between items-center w-full text-5xl absolute top-0 px-5 py-5">
            <p>{playerData?.name} {playerData?.isStoryteller ? "(Storyteller)" : playerData?.isSeated ? "(Player)" : "(Spectator)"}</p>
            <p>Room Code: {roomId}</p>
            <svg
              className="cursor-pointer"
              onClick={() => router.push("/")}
              width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 0C1.34314 0 0 1.34315 0 3V27C0 28.6569 1.34315 30 3 30H13.5C15.1569 30 16.5 28.6569 16.5 27V19.5H9C7.34315 19.5 6 18.1569 6 16.5V13.5C6 11.8431 7.34315 10.5 9 10.5H16.5V3C16.5 1.34315 15.1569 0 13.5 0H3Z" fill="#51277D"/>
              <path d="M9 13.5V16.5L24.8787 16.5L21.4393 19.9393C20.8536 20.5251 20.8536 21.4749 21.4393 22.0607C22.0251 22.6464 22.9749 22.6464 23.5607 22.0607L29.3485 16.2728C29.386 16.2353 29.4214 16.1966 29.4549 16.1568C29.7878 15.8817 30 15.4656 30 15C30 14.5344 29.7878 14.1183 29.4549 13.8432C29.4214 13.8034 29.386 13.7647 29.3485 13.7272L23.5607 7.93934C22.9749 7.35355 22.0251 7.35355 21.4393 7.93934C20.8536 8.52513 20.8536 9.47487 21.4393 10.0607L24.8787 13.5L9 13.5Z" fill="#51277D"/>
            </svg>
          </div>
          <div className="flex flex-col justify-center items-center absolute bottom-0">
            {playerData?.isStoryteller ?
            <DashboardStoryteller
              roomData={roomData}
              updateRoomData={updateRoomData}
              updatePlayerById={updatePlayerById}
              handleStartVote={handleStartVote}
              isStoryteller={playerData.isStoryteller}
              showRoles={showRoles}
              setShowRoles={setShowRoles}
              setOpenAssigns={setOpenAssigns}
            />
              :
            <DashboardPlayer
              roomData={roomData}
              playerData={playerData}
              updateRoomData={updateRoomData}
              updatePlayerById={updatePlayerById}
              updatePlayerData={updatePlayerData}
              updateVotingData={updateVotingData}
              setOpenAssigns={setOpenAssigns}
            />}
          </div>

          <div className="flex flex-col items-start h-auto w-auto absolute left-0 mt-auto mb-auto">
            <CardSide 
              className="text-2xl"
              icon={<svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 0C2.35051 0 0 2.29237 0 5.12016V22.1874C0 25.0152 2.35051 27.3075 5.25 27.3075H18.8125L26.9068 33.6228C28.0526 34.5168 29.75 33.7212 29.75 32.2901V27.3075H30.6514C33.0531 27.3075 35 25.4088 35 23.0665V5.12016C35 2.29237 32.6495 0 29.75 0H5.25Z" fill="#51277D"/>
                    </svg>}
                    >
              <ChatBox roomId={roomData.id} player={playerData} />
            </CardSide>
          </div>
          
          <div className="flex flex-col items-end h-auto w-auto gap-5 absolute right-0 mt-auto mb-auto">
            <CardSide 
              cardIndex={1}
              setOpenCard={setOpenCard}
              open={openCard == 1}
              side='right'
              className="text-2xl"
              icon={<svg width="36" height="26" viewBox="0 0 36 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 10.8C20.9823 10.8 23.4 8.38233 23.4 5.4C23.4 2.41766 20.9823 0 18 0C15.0177 0 12.6 2.41766 12.6 5.4C12.6 8.38233 15.0177 10.8 18 10.8Z" fill="#51277D"/>
                      <path d="M11.7354 7.44132C11.7354 9.68684 9.91508 11.5072 7.66955 11.5072C5.42403 11.5072 3.60367 9.68684 3.60367 7.44132C3.60367 5.1958 5.42403 3.37544 7.66955 3.37544C9.91508 3.37544 11.7354 5.1958 11.7354 7.44132Z" fill="#51277D"/>
                      <path d="M17.9997 12.4072C13.9947 12.4072 11.5928 13.898 10.2366 15.8801C8.92586 17.7957 8.71707 21.7903 8.7129 23.0052C8.70871 24.227 9.68566 25.0244 10.6873 25.0244H25.312C26.3137 25.0244 27.2906 24.227 27.2864 23.0052C27.2822 21.7903 27.0735 17.7957 25.7628 15.8801C24.4066 13.898 22.0047 12.4072 17.9997 12.4072Z" fill="#51277D"/>
                      <path d="M9.77243 13.5838C9.30473 14.028 8.9 14.5101 8.55188 15.0189C6.95648 17.3506 6.70236 21.822 6.69728 23.3008C6.69626 23.598 6.74294 23.8746 6.82802 24.1269H1.63056C0.803368 24.1269 -0.0034505 23.4683 1.10989e-05 22.4593C0.0034536 21.4559 0.175888 17.8437 1.25837 16.2617C2.3784 14.6247 4.36201 13.3936 7.66959 13.3936C8.44052 13.3936 9.13952 13.4605 9.77243 13.5838Z" fill="#51277D"/>
                      <path d="M29.1737 24.1269C29.2587 23.8746 29.3054 23.598 29.3044 23.3008C29.2993 21.822 29.0452 17.3506 27.4499 15.0189C27.1016 14.51 26.6968 14.0277 26.2289 13.5834C26.8613 13.4603 27.5596 13.3936 28.3297 13.3936C31.6373 13.3936 33.6209 14.6247 34.741 16.2617C35.8234 17.8437 35.9958 21.4559 35.9993 22.4593C36.0027 23.4683 35.1959 24.1269 34.3687 24.1269H29.1737Z" fill="#51277D"/>
                      <path d="M32.3956 7.44132C32.3956 9.68684 30.5752 11.5072 28.3297 11.5072C26.0842 11.5072 24.2638 9.68684 24.2638 7.44132C24.2638 5.1958 26.0842 3.37544 28.3297 3.37544C30.5752 3.37544 32.3956 5.1958 32.3956 7.44132Z" fill="#51277D"/>
                    </svg>}
                    >
              <PlayerList 
                roomData={roomData}
                currentPlayer={currentPlayer}
                setOpenCharacter={setOpenCharacter} 
                setSelectedCharacter={setSelectedCharacter} 
                handleKickPlayer={handleKickPlayer}
              />
            </CardSide>

            <CardSide 
              cardIndex={2}
              setOpenCard={setOpenCard}
              open={openCard == 2}
              side='right'
              className="text-2xl"
              icon={<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M17.5 35C27.165 35 35 27.165 35 17.5C35 7.83502 27.165 0 17.5 0C7.83502 0 0 7.83502 0 17.5C0 27.165 7.83502 35 17.5 35ZM17.5 10.5C15.3377 10.5 14 12.1987 14 14C14 14.9665 13.2165 15.75 12.25 15.75C11.2835 15.75 10.5 14.9665 10.5 14C10.5 10.5513 13.131 7 17.5 7C21.869 7 24.5 10.5513 24.5 14C24.5 17.5821 21.7987 19.4947 20.9076 19.9402C20.7744 20.0068 20.6256 20.0701 20.5214 20.1144L20.475 20.1341C20.3708 20.1783 20.2749 20.219 20.1728 20.265C19.9405 20.3696 19.7391 20.4742 19.5737 20.5882C19.25 20.8112 19.25 20.9241 19.25 21C19.25 21.9665 18.4665 22.75 17.5 22.75C16.5335 22.75 15.75 21.9665 15.75 21C15.75 19.3259 16.7548 18.28 17.5881 17.7059C18.0017 17.421 18.418 17.2168 18.7358 17.0736C18.9703 16.968 19.0892 16.9192 19.1705 16.8858C19.2387 16.8578 19.2807 16.8406 19.3424 16.8098C19.4393 16.7613 19.8904 16.4804 20.3002 15.9658C20.688 15.4789 21 14.8356 21 14C21 12.1987 19.6623 10.5 17.5 10.5ZM17.5 26.25C16.5335 26.25 15.75 27.0335 15.75 28C15.75 28.9665 16.5335 29.75 17.5 29.75C18.4665 29.75 19.25 28.9665 19.25 28C19.25 27.0335 18.4665 26.25 17.5 26.25Z" fill="#51277D"/>
                    </svg>}
                    >
              <div className="w-[200px] h-[150px] pl-5">
                <div 
                  className="cursor-pointer"
                  onClick={() => 
                    {
                      setOpenCharReference(true)
                      setOpenCard(0)
                    }}                  
                  >
                  <p>Reference Sheet [R]</p>
                </div>
                <div 
                  className="cursor-pointer"
                  onClick={() => 
                    {
                      setOpenNightReference(true)
                      setOpenCard(0)
                    }}                  
                  >
                  <p>Night Order Sheet [N]</p>
                </div>
                <div 
                  className="cursor-pointer"
                  onClick={() => 
                    {
                      setOpenHelp(true)
                      setOpenCard(0)
                    }}                  
                  >
                  <p>How to Play</p>
                </div>
              </div>
                
            </CardSide>
          </div>
        </>
      )}
      <CardPopup title={selectedCharacter?.name || ""} open={openCharacter} setOpen={setOpenCharacter}>
        <SelectedCharacter 
          selectedCharacter={selectedCharacter} 
          isStoryteller={currentPlayer.isStoryteller} 
          updateRoomData={updateRoomData}
          updateVotingData={updateVotingData}
          updatePlayerById={updatePlayerById}
          handleKickPlayer={handleKickPlayer}
          setOpenCharacter={setOpenCharacter}
          />
      </CardPopup>
      <CardPopup title={"Character Reference Sheet"} open={openCharReference} setOpen={setOpenCharReference}>
        <CharacterSheet />
      </CardPopup>
      <CardPopup title={"Night Reference Sheet"} open={openNightReference} setOpen={setOpenNightReference}>

      </CardPopup>
      <CardPopup title={"How to Play"} open={openHelp} setOpen={setOpenHelp}>

      </CardPopup>
      <CardPopup title={"Choose & Assign Roles"} open={openAssigns} setOpen={setOpenAssigns}>
        <AssignRoles 
          script={TroubleBrewing} 
          setSelectedRoles={setSelectedRoles} 
          selectedRoles={selectedRoles}
          updatePlayerById={updatePlayerById}
          playerList={seatedPlayers}
          totalPlayers={seatedPlayers.length} />
      </CardPopup>
    </div>
  );
}

export default RoomPage;