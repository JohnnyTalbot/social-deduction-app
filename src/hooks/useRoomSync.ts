import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import { ref, update, onValue, off, set, get } from 'firebase/database'; // Import 'get'
import { db } from '@/lib/firebase';
import { Player, Room, Seat } from '@/types/game';
import { flushSync } from 'react-dom';
// Removed 'get' from 'http' as it's incorrect and likely a typo

export function useRoomSync(roomId: string) {
  const router = useRouter();
  const [roomData, setRoomData] = useState<Room>();
  const [playerData, setPlayerData] = useState<Player>();

  const roomDataRef = useRef<Room | undefined>(undefined);

  const updateRoomData = (partial: Partial<Room>) => {
    if (!roomId) return;
    update(ref(db, `rooms/${roomId}`), partial);
  };

  const updatePlayerData = (partial: Partial<Player>) => {
    if (!roomId || !playerData?.id) return;
    update(ref(db, `rooms/${roomId}/players/${playerData.id}`), partial);
  };

  const updatePlayerById = (playerId: string, partial: Partial<Player>) => {
    if (!roomId || !playerId) return;
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    update(playerRef, partial);
  };

  const updateVotingData = (partial: Partial<Room["votingData"]>) => {
    if (!roomId) return;
    const votingDataRef = ref(db, `rooms/${roomId}/votingData`);
    update(votingDataRef, partial || {});
  };

  const getPlayerById = (playerId: string): Player | undefined => {
    if (!roomDataRef.current || !roomDataRef.current.players) return undefined;
    return roomDataRef.current.players[playerId];
  }

  // --- Handlers for Game Logic ---

  const handleKickPlayer = (playerToKick: Player) => {
    if (!roomData || !playerToKick?.seatNumber) return;
    if (!Array.isArray(roomData.seats)) return null;

    const updatedSeats = roomData.seats.map(seat => {
      if (seat.playerId === playerToKick.id) {
        return { ...seat, playerId: '', isTaken: false };
      }
      return seat;
    });

    flushSync(() => {
      updateRoomData({ seats: updatedSeats });
    });

    updatePlayerById(playerToKick.id, {
      isSeated: false,
      wasKicked: true
    });
  };

  const handleStartVote = (currentNominated: string) => {
    if (!currentNominated) {
      alert("No player nominated for vote.");
      return;
    }

    if (!roomDataRef.current) {
      alert("Room data not loaded yet.");
      return;
    }

    const seatsAtStart = roomDataRef.current.seats;
    if (!seatsAtStart) return;

    const nominatedIndex = seatsAtStart.findIndex(s => s.playerId === currentNominated);
    if (nominatedIndex === -1) {
      alert("Nominated player is not seated.");
      return;
    }

    let countdown = 3;

    const runCountdown = () => {
      updateVotingData({
        phase: "countdown",
        countdown,
        votes: { [currentNominated]: [] },
      });

      if (countdown === 0) {
        beginVoting(nominatedIndex);
        return;
      }

      countdown--;
      setTimeout(runCountdown, 1000);
    };

    const beginVoting = (startIndex: number) => {
      const votingOrder = getVotingSeatsInOrder(roomDataRef.current?.seats || [], startIndex);
      let currentIndex = 0;

      const proceedToNextVoter = async () => { // Make this function async
        const currentSeat = votingOrder[currentIndex];

        // Process votes from previously passed players if any
        if (currentIndex > 0) {
          const previouslyPassedSeats = votingOrder.slice(0, currentIndex);

          // Crucial: Fetch the absolute latest room data before processing votes
          const roomSnapshot = await get(ref(db, `rooms/${roomId}`));
          const latestRoomData = roomSnapshot.val() as Room | null;

          if (!latestRoomData) {
            console.error("Could not fetch latest room data for vote processing.");
            return;
          }

          previouslyPassedSeats.forEach(seat => {
            const playerId = seat.playerId;
            // Use the *latestRoomData* for players and voting information
            const player = playerId ? latestRoomData.players?.[playerId] : undefined;

            if (!playerId || !player) return;

            if (player.isVoting) {
              const currentVotes = latestRoomData.votingData?.votes || {}; // Use latestRoomData
              const existingVoters = currentVotes[currentNominated] || [];

              if (!existingVoters.includes(playerId)) {
                const updatedVotes = {
                  ...currentVotes,
                  [currentNominated]: [...existingVoters, playerId],
                };
                updateVotingData({
                  votes: updatedVotes,
                });
              }
            }
          });
        }

        if (!currentSeat) {
          console.log("Ending voting phase");
          Object.entries(roomDataRef.current?.players || {}).forEach(([playerId, player]) => {
            if (player.isVoting) {
              updatePlayerById(playerId, {
                isVoting: false,
                canVote: player.isAlive ? player.canVote : false,
              });
            }
          });

          updateVotingData({
            phase: "nominations",
            currentNominated: "",
            currentlyVoting: null,
          });
          return;
        }

        updateVotingData({
          phase: "voting",
          currentlyVoting: currentSeat,
        });

        setTimeout(() => {
          currentIndex++;
          proceedToNextVoter();
        }, 3000);
      };

      proceedToNextVoter();
    };

    function getVotingSeatsInOrder(seats: Seat[], startIndex: number): Seat[] {
      const canVote = (seat: Seat) =>
        seat.isTaken &&
        typeof seat.playerId === 'string' &&
        roomDataRef.current?.players[seat.playerId]?.canVote;

      const orderedSeats = [...seats.slice(startIndex), ...seats.slice(0, startIndex)];
      return orderedSeats.filter(canVote);
    }

    runCountdown();
  };

  // --- Firebase Read Listeners (Updates Local State) ---

  useEffect(() => {
    if (!roomId || !playerData?.id) return;

    const playerRef = ref(db, `rooms/${roomId}/players/${playerData.id}`);
    const unsubscribePlayer = onValue(playerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayerData((prev) => prev ? { ...prev, ...data } : data);
      }
    });

    return () => off(playerRef, 'value', unsubscribePlayer);
  }, [roomId, playerData?.id]);

// Inside useRoomSync.ts

  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      const incomingRoom = snapshot.val();
      if (incomingRoom) {
        console.log("Firebase 'onValue' fired. incomingRoom.votingData.votes:", incomingRoom.votingData?.votes); // <-- NEW LOG
        setRoomData((prev) => {
          if (!prev) {
            roomDataRef.current = incomingRoom;
            return incomingRoom;
          }

          const mergedPlayers = { ...prev.players };
          for (const playerId in incomingRoom.players) {
            mergedPlayers[playerId] = {
              ...(prev.players?.[playerId] || {}),
              ...incomingRoom.players[playerId],
            };
          }

          const newVotingData = {
            ...(prev.votingData || {}),
            ...(incomingRoom.votingData || {}),
          };
          if (incomingRoom.votingData && 'votes' in incomingRoom.votingData) {
              newVotingData.votes = incomingRoom.votingData.votes;
          } else {
              newVotingData.votes = {};
          }

          const newRoomData = {
            ...prev,
            ...incomingRoom,
            players: mergedPlayers,
            votingData: newVotingData,
            seats: incomingRoom.seats || prev.seats,
          };

          roomDataRef.current = newRoomData;
          return newRoomData;
        });
      }
    });

    return () => off(roomRef, 'value', unsubscribeRoom);
  }, [roomId]);

  // --- Side Effects based on Player Data ---

  useEffect(() => {
    if (playerData?.wasKicked) {
      alert("You were removed from the game.");
      router.push('/join')
    }
  }, [playerData, router]);

  // --- Return Values ---

  return {
    roomData,
    playerData,
    setRoomData,
    setPlayerData,
    updateRoomData,
    updatePlayerData,
    updatePlayerById,
    getPlayerById,
    updateVotingData,
    handleKickPlayer,
    handleStartVote
  };
}