import { useState } from 'react';
import { Room, Player, Seat } from '@/types/game';

interface DashboardStorytellerProps {
  roomData: Room | unknown;
  playerData: Player | unknown;
  updateRoomData: (partial: Partial<Room>) => void;
  updatePlayerData: (partial: Partial<Player>) => void;
  updatePlayerById: (playerId: string, partial: Partial<Player>) => void;
  updateVotingData: (partial: Partial<Room["votingData"]>) => void;
  setOpenAssigns: (openAssigns: boolean) => void;
  className?: string;
}

export default function DashboardStoryteller({
  className,
  roomData,
  playerData,
  updateRoomData,
  updatePlayerData,
  updatePlayerById,
  updateVotingData,
  setOpenAssigns,
}: DashboardStorytellerProps) {
  const room = roomData as Room;
  const player = playerData as Player;
  const [hoveredIcon, setHoveredIcon] = useState<string>("");

  const getLabel = () => {
    switch (hoveredIcon) {
      case "vote":
        return "Vote to Eliminate";
      case "emote":
        return "Use Emote";
      default:
        return "";
    }
  };

  return (
    <div className="m-2">
      <div className="flex justify-center text-lg lg:text-2xl h-[25px] lg:h-[35px]">{getLabel()}</div>
        <div
          className={`flex flex-row justify-center items-center gap-4 lg:gap-6 bg-card p-3 lg:p-5 ${className}`}
          style={{
            boxSizing: "border-box",
            border: "3px solid #000000",
            boxShadow: "-5px 5px 0px #000000",
            borderRadius: "30px",
          }}
        >

          {/* Vote */}
          <div
            className="cursor-pointer"
            onMouseEnter={() => setHoveredIcon("vote")}
            onMouseLeave={() => setHoveredIcon("")}
            onClick={() => {
              if (!room.votingData || room.votingData.phase === "nominations") {
                alert("Voting hasn't started yet!");
                return;
              }
              if (!player.canVote) {
                alert("You are no longer able to vote.");
                return;
              }

              const newVotingState = !player.isVoting;
              updatePlayerData({ isVoting: newVotingState });
            }}
          >
            <svg className='w-[23px] h-[23px] lg:w-[30px] lg:h-[30px]' width="30" height="30" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.7314 42C12.917 42 7.69108 38.5 5.53296 33.25L0.128729 19.8975C-0.424179 18.515 0.895666 17.1325 2.34036 17.5875L3.74938 18.0425C4.74819 18.375 5.56863 19.11 5.96102 20.0725L8.47586 26.25H9.81354V5.6875C9.81354 4.48 10.8123 3.5 12.043 3.5C13.2737 3.5 14.2725 4.48 14.2725 5.6875V21H16.056V2.1875C16.056 0.98 17.0548 0 18.2855 0C19.5162 0 20.515 0.98 20.515 2.1875V21H22.2986V4.8125C22.2986 3.605 23.2974 2.625 24.528 2.625C25.7587 2.625 26.7575 3.605 26.7575 4.8125V21H28.5411V10.0625C28.5411 8.855 29.5399 7.875 30.7705 7.875C32.0012 7.875 33 8.855 33 10.0625V28C33 35.735 26.6148 42 18.7314 42Z" fill="#51277D"/>
            </svg>
          </div>

          {/* Emote */}
          <div
            className="cursor-pointer"
            onMouseEnter={() => setHoveredIcon("emote")}
            onMouseLeave={() => setHoveredIcon("")}
          >
            <svg className='w-[23px] h-[23px] lg:w-[30px] lg:h-[30px]' width="30" height="30" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 0C7.8225 0 0 7.875 0 17.5C0 22.1413 1.84374 26.5925 5.12563 29.8744C6.75066 31.4994 8.67984 32.7884 10.803 33.6679C12.9262 34.5474 15.2019 35 17.5 35C22.1413 35 26.5925 33.1563 29.8744 29.8744C33.1563 26.5925 35 22.1413 35 17.5C35 15.2019 34.5474 12.9262 33.6679 10.803C32.7884 8.67984 31.4994 6.75066 29.8744 5.12563C28.2493 3.50061 26.3202 2.21157 24.197 1.33211C22.0738 0.452651 19.7981 0 17.5 0V0ZM23.625 10.5C24.3212 10.5 24.9889 10.7766 25.4812 11.2688C25.9734 11.7611 26.25 12.4288 26.25 13.125C26.25 13.8212 25.9734 14.4889 25.4812 14.9812C24.9889 15.4734 24.3212 15.75 23.625 15.75C22.9288 15.75 22.2611 15.4734 21.7688 14.9812C21.2766 14.4889 21 13.8212 21 13.125C21 12.4288 21.2766 11.7611 21.7688 11.2688C22.2611 10.7766 22.9288 10.5 23.625 10.5V10.5ZM11.375 10.5C12.0712 10.5 12.7389 10.7766 13.2312 11.2688C13.7234 11.7611 14 12.4288 14 13.125C14 13.8212 13.7234 14.4889 13.2312 14.9812C12.7389 15.4734 12.0712 15.75 11.375 15.75C10.6788 15.75 10.0111 15.4734 9.51884 14.9812C9.02656 14.4889 8.75 13.8212 8.75 13.125C8.75 12.4288 9.02656 11.7611 9.51884 11.2688C10.0111 10.7766 10.6788 10.5 11.375 10.5ZM17.5 27.125C13.4225 27.125 9.9575 24.57 8.5575 21H26.4425C25.025 24.57 21.5775 27.125 17.5 27.125Z" fill="#51277D"/>
            </svg>
          </div>

        </div>
    </div>
  );
}


