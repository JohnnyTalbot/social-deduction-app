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
import { Card, CardSide, CardPopup } from "@/components/ui/Card";
import Loading from "@/components/Loading";
import ChatBox from "@/components/ChatBox";

function RoomPage() {
  const router = useRouter();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [openCard, setOpenCard] = useState(0);
  const [openCharReference, setOpenCharReference] = useState(false)
  const [openNightReference, setOpenNightReference] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
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
    <div className="flex flex-col justify-center items-center w-full h-screen overflow-x-hidden">
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
              <div className="w-[200px] h-[200px] pl-5">
                {roomData.players &&
                Object.values(roomData.players)
                  .filter((player) => player.state === "online")
                  .map((player) => (
                    <div key={player.id}>
                      {player.isStoryteller
                        ? <div>
                            <p>{player.name}{" "}(Storyteller)</p>
                          </div>
                        : player.isSeated
                        ? <div className="flex flex-row items-center justify-between">
                            <p className="text-[#51277D]">{player.name}{" "}(Player)</p>
                            <div className="flex flex-row justify-center items-center gap-2">
                              <svg className="cursor-pointer" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.29446 1.90909C6.29446 0.854729 7.12397 0 8.14723 0H11.8528C12.876 0 13.7055 0.854729 13.7055 1.90909V2.80209C14.021 2.96361 14.3251 3.1451 14.6163 3.34497L15.3678 2.89789C16.2539 2.37071 17.3871 2.68357 17.8987 3.59667L19.7515 6.90331C20.2631 7.81642 19.9595 8.984 19.0733 9.51118L18.3212 9.95862C18.332 10.1377 18.3375 10.3182 18.3375 10.5C18.3375 10.6819 18.332 10.8624 18.3212 11.0415L19.0731 11.4888C19.9593 12.016 20.2629 13.1836 19.7513 14.0967L17.8985 17.4033C17.3869 18.3164 16.2538 18.6293 15.3676 18.1021L14.6162 17.6551C14.325 17.8549 14.0209 18.0364 13.7055 18.1979V19.0909C13.7055 20.1453 12.876 21 11.8528 21H8.14723C7.12397 21 6.29446 20.1453 6.29446 19.0909V18.1979C5.97906 18.0364 5.67499 17.8549 5.38381 17.6551L4.6324 18.1021C3.74623 18.6293 2.61309 18.3164 2.10147 17.4033L0.248697 14.0967C-0.262931 13.1836 0.0406917 12.016 0.926858 11.4888L1.67883 11.0415C1.66802 10.8624 1.66254 10.6819 1.66254 10.5C1.66254 10.3182 1.66802 10.1377 1.67882 9.95864L0.926694 9.5112C0.0405279 8.98402 -0.263095 7.81643 0.248534 6.90333L2.1013 3.59669C2.61293 2.68358 3.74607 2.37073 4.63223 2.89791L5.38373 3.34498C5.67493 3.14511 5.97903 2.96361 6.29446 2.80209V1.90909ZM10.0003 15.2727C12.5584 15.2727 14.6322 13.1359 14.6322 10.5C14.6322 7.8641 12.5584 5.72727 10.0003 5.72727C7.44211 5.72727 5.36833 7.8641 5.36833 10.5C5.36833 13.1359 7.44211 15.2727 10.0003 15.2727Z" fill="#565656"/>
                                <path d="M12.7794 10.5C12.7794 12.0815 11.5351 13.3636 10.0003 13.3636C8.46537 13.3636 7.2211 12.0815 7.2211 10.5C7.2211 8.91846 8.46537 7.63636 10.0003 7.63636C11.5351 7.63636 12.7794 8.91846 12.7794 10.5Z" fill="#565656"/>
                              </svg>
                              <svg className="cursor-pointer" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.389165 0.396985C0.907962 -0.119475 1.74899 -0.119372 2.26766 0.397215L7.46409 5.56937L12.6671 0.387816C13.1856 -0.128942 14.0266 -0.12932 14.5456 0.386971C15.0646 0.903261 15.0649 1.74071 14.5464 2.25747L9.34236 7.4401L14.6111 12.7422C15.1297 13.2588 15.1296 14.0963 14.6108 14.6127C14.092 15.1292 13.251 15.1291 12.7323 14.6125L7.46471 9.31145L2.31188 14.5723C1.79338 15.089 0.95235 15.0894 0.433382 14.5731C-0.0855855 14.0568 -0.0859656 13.2194 0.432533 12.7026L5.58644 7.44072L0.388934 2.26748C-0.129735 1.7509 -0.129632 0.913446 0.389165 0.396985Z" fill="#F54242"/>
                              </svg>
                            </div>
                          </div>
                        : <div className="flex flex-row items-center justify-between">
                            <p className="opacity-50">{player.name}{" "}Spectator)</p>
                            <div className="flex flex-row items-center gap-2">
                              <svg className="cursor-pointer" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.29446 1.90909C6.29446 0.854729 7.12397 0 8.14723 0H11.8528C12.876 0 13.7055 0.854729 13.7055 1.90909V2.80209C14.021 2.96361 14.3251 3.1451 14.6163 3.34497L15.3678 2.89789C16.2539 2.37071 17.3871 2.68357 17.8987 3.59667L19.7515 6.90331C20.2631 7.81642 19.9595 8.984 19.0733 9.51118L18.3212 9.95862C18.332 10.1377 18.3375 10.3182 18.3375 10.5C18.3375 10.6819 18.332 10.8624 18.3212 11.0415L19.0731 11.4888C19.9593 12.016 20.2629 13.1836 19.7513 14.0967L17.8985 17.4033C17.3869 18.3164 16.2538 18.6293 15.3676 18.1021L14.6162 17.6551C14.325 17.8549 14.0209 18.0364 13.7055 18.1979V19.0909C13.7055 20.1453 12.876 21 11.8528 21H8.14723C7.12397 21 6.29446 20.1453 6.29446 19.0909V18.1979C5.97906 18.0364 5.67499 17.8549 5.38381 17.6551L4.6324 18.1021C3.74623 18.6293 2.61309 18.3164 2.10147 17.4033L0.248697 14.0967C-0.262931 13.1836 0.0406917 12.016 0.926858 11.4888L1.67883 11.0415C1.66802 10.8624 1.66254 10.6819 1.66254 10.5C1.66254 10.3182 1.66802 10.1377 1.67882 9.95864L0.926694 9.5112C0.0405279 8.98402 -0.263095 7.81643 0.248534 6.90333L2.1013 3.59669C2.61293 2.68358 3.74607 2.37073 4.63223 2.89791L5.38373 3.34498C5.67493 3.14511 5.97903 2.96361 6.29446 2.80209V1.90909ZM10.0003 15.2727C12.5584 15.2727 14.6322 13.1359 14.6322 10.5C14.6322 7.8641 12.5584 5.72727 10.0003 5.72727C7.44211 5.72727 5.36833 7.8641 5.36833 10.5C5.36833 13.1359 7.44211 15.2727 10.0003 15.2727Z" fill="#565656"/>
                                <path d="M12.7794 10.5C12.7794 12.0815 11.5351 13.3636 10.0003 13.3636C8.46537 13.3636 7.2211 12.0815 7.2211 10.5C7.2211 8.91846 8.46537 7.63636 10.0003 7.63636C11.5351 7.63636 12.7794 8.91846 12.7794 10.5Z" fill="#565656"/>
                              </svg>
                              <svg className="cursor-pointer" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.389165 0.396985C0.907962 -0.119475 1.74899 -0.119372 2.26766 0.397215L7.46409 5.56937L12.6671 0.387816C13.1856 -0.128942 14.0266 -0.12932 14.5456 0.386971C15.0646 0.903261 15.0649 1.74071 14.5464 2.25747L9.34236 7.4401L14.6111 12.7422C15.1297 13.2588 15.1296 14.0963 14.6108 14.6127C14.092 15.1292 13.251 15.1291 12.7323 14.6125L7.46471 9.31145L2.31188 14.5723C1.79338 15.089 0.95235 15.0894 0.433382 14.5731C-0.0855855 14.0568 -0.0859656 13.2194 0.432533 12.7026L5.58644 7.44072L0.388934 2.26748C-0.129735 1.7509 -0.129632 0.913446 0.389165 0.396985Z" fill="#F54242"/>
                              </svg>
                            </div>
                          </div>
                        }
                    </div>
                  ))}
              </div>
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
      <CardPopup title={"Character Reference Sheet"} open={openCharReference} setOpen={setOpenCharReference}>

      </CardPopup>
      <CardPopup title={"Night Reference Sheet"} open={openNightReference} setOpen={setOpenNightReference}>

      </CardPopup>
      <CardPopup title={"How to Play"} open={openHelp} setOpen={setOpenHelp}>

      </CardPopup>
    </div>
  );
}

export default RoomPage;