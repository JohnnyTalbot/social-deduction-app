import { Room, Player } from "@/types/game";

interface VoteListProps {
  roomData: Room;
  getPlayerById: (playerId: string) => Player | undefined;
  updateVotingData?: (partial: Partial<Room["votingData"]>) => void;
  isStoryteller?: boolean;
}

function VoteList({ roomData, getPlayerById, updateVotingData, isStoryteller }: VoteListProps) {

  return (
    <div className="w-[250px] h-[200px] px-5 overflow-y-scroll custom-scrollbar">
      <div className="flex flex-row justify-between items-center mb-3">
        <p className="text-[#51277D] font-bold">Vote List</p>
        {isStoryteller && (
          <button
            className="text-[#51277D] font-bold cursor-pointer"
            onClick={() => updateVotingData?.({ votes: {} })}
          >
            Clear Votes
          </button>
        )}
      </div>
      
      {roomData.votingData?.votes && Object.entries(roomData.votingData.votes).length > 0 ? (
        Object.entries(roomData.votingData.votes).map(([playerId, voteList]) => {
          const player = getPlayerById(playerId);
          return (
            <div key={playerId} className="flex flex-row gap-3 items-center">
              <p className="text-[#51277D]">{player?.name} :</p>
              <p className="text-[#565656]">{voteList.length} votes</p>
              {/* {voteList.length > 0 && (
                <div className="flex flex-row gap-2">
                  {voteList.map((vote, index) => (
                    <p key={index} className="text-[#565656]">{getPlayerById(vote)?.name}</p>
                  ))}
                </div>
              )} */}
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No votes cast yet.</p>
      )}
    </div>
  )
}

export default VoteList;