import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import { ref, update, onValue, off, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Player, Room, Seat } from '@/types/game';
import { flushSync } from 'react-dom';

export function useRoomSync(roomId: string) {
  const router = useRouter();
  const [roomData, setRoomData] = useState<Room>();
  const [playerData, setPlayerData] = useState<Player>();

  // Ref to store the latest roomData, to avoid stale closures in async operations
  const roomDataRef = useRef<Room | undefined>(undefined);

  // --- Firebase Write Operations (Directly to DB) ---
  // These functions now directly update Firebase.
  // The local state (`roomData`, `playerData`) will be updated
  // automatically by the `onValue` listeners.

  const updateRoomData = (partial: Partial<Room>) => {
    if (!roomId) return;
    update(ref(db, `rooms/${roomId}`), partial);
  };

  const updatePlayerData = (partial: Partial<Player>) => {
    // Note: playerData?.id is used here to identify the current player for update
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
    // Ensure 'partial' is an object to satisfy Firebase `update` and TypeScript
    update(votingDataRef, partial || {});
  };

  // --- Handlers for Game Logic ---

  const handleKickPlayer = (playerToKick: Player) => {
    // It's good practice to ensure roomData and playerToKick are available
    if (!roomData || !playerToKick?.seatNumber) return;
    if (!Array.isArray(roomData.seats)) return null;

    // Remove from seat (optimistic update via local state for immediate feedback)
    const updatedSeats = roomData.seats.map(seat => {
      if (seat.playerId === playerToKick.id) {
        return { ...seat, playerId: '', isTaken: false };
      }
      return seat;
    });

    // Use flushSync if you need the UI to update synchronously before a Firebase write
    // However, since updateRoomData now writes to Firebase, and onValue will update local state,
    // this flushSync might not be strictly necessary or might even lead to a brief double-render.
    // Consider if you truly need synchronous UI update before Firebase reflects the change.
    flushSync(() => {
      updateRoomData({ seats: updatedSeats }); // This now writes to Firebase directly
    });

    // Update player info in Firebase
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

    // Check roomData existence. The actual voting logic will use the ref.
    if (!roomDataRef.current) { // Use the ref for consistency
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
      // Use updateVotingData which writes directly to Firebase
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
      // `getVotingSeatsInOrder` now relies on roomDataRef.current for latest player data
      const votingOrder = getVotingSeatsInOrder(roomDataRef.current?.seats || [], startIndex);
      let currentIndex = 0;

      const proceedToNextVoter = () => {
        const currentSeat = votingOrder[currentIndex];

        // Process votes from previously passed players if any
        if (currentIndex > 0) {
          const previouslyPassedSeats = votingOrder.slice(0, currentIndex);
          previouslyPassedSeats.forEach(seat => {
            const playerId = seat.playerId;
            // Crucial: Use roomDataRef.current to get the latest player state
            const player = playerId ? roomDataRef.current?.players[playerId] : undefined;

            if (!playerId || !player) return;

            // Only add vote if the player actively set isVoting to true and hasn't already voted
            if (player.isVoting) {
              const currentVotes = roomDataRef.current?.votingData?.votes || {};
              const existingVoters = currentVotes[currentNominated] || [];

              if (!existingVoters.includes(playerId)) {
                console.log("Adding vote for player:", player.name);
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
          // End voting
          console.log("Ending voting phase");
          // Ensure all players who were voting have their state reset
          Object.entries(roomDataRef.current?.players || {}).forEach(([playerId, player]) => {
            if (player.isVoting) { // Check the latest state from the ref
              console.log("Resetting player voting state for:", player.name);
              updatePlayerById(playerId, {
                isVoting: false,
                canVote: player.isAlive ? player.canVote : false,
              });
            }
          });

          // Reset voting data in the room
          updateVotingData({
            phase: "nominations",
            currentNominated: "",
            currentlyVoting: null,
          });
          return;
        }

        // Update current voting status for the room
        updateVotingData({
          phase: "voting",
          currentlyVoting: currentSeat,
        });

        // Proceed to the next voter after a delay
        setTimeout(() => {
          currentIndex++;
          proceedToNextVoter();
        }, 3000);
      };

      proceedToNextVoter(); // Start the voting sequence
    };

    // Helper function to get voting seats in order, using the latest player data
    function getVotingSeatsInOrder(seats: Seat[], startIndex: number): Seat[] {
      const canVote = (seat: Seat) =>
        seat.isTaken &&
        typeof seat.playerId === 'string' &&
        // Crucial: Use roomDataRef.current for the latest player state
        roomDataRef.current?.players[seat.playerId]?.canVote;

      const orderedSeats = [...seats.slice(startIndex), ...seats.slice(0, startIndex)];
      return orderedSeats.filter(canVote);
    }

    runCountdown(); // Initial call to start the countdown
  };

  // --- Firebase Read Listeners (Updates Local State) ---

  // Listen for current player data changes
  // This listener is specific to the currently logged-in player
  useEffect(() => {
    // Only set up if roomId and playerData.id are available
    if (!roomId || !playerData?.id) return;

    const playerRef = ref(db, `rooms/${roomId}/players/${playerData.id}`);
    const unsubscribePlayer = onValue(playerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Merge incoming data with existing playerData state
        setPlayerData((prev) => prev ? { ...prev, ...data } : data);
      }
    });

    // Cleanup listener on unmount or dependencies change
    return () => off(playerRef, 'value', unsubscribePlayer);
  }, [roomId, playerData?.id]); // Re-run if roomId or playerData.id changes

  // Listen for room data changes (all players, voting data, seats etc.)
  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      const incomingRoom = snapshot.val();
      if (incomingRoom) {
        setRoomData((prev) => {
          if (!prev) {
            roomDataRef.current = incomingRoom; // Initialize ref on first data load
            return incomingRoom;
          }

          // Deep merge for players to preserve existing properties like 'isVoting'
          const mergedPlayers = { ...prev.players };
          for (const playerId in incomingRoom.players) {
            mergedPlayers[playerId] = {
              ...(prev.players?.[playerId] || {}), // Take previous player state
              ...incomingRoom.players[playerId], // Overlay with incoming player state
            };
          }

          const newRoomData = {
            ...prev, // Keep previous properties not in incomingRoom (e.g., if a sub-path wasn't updated)
            ...incomingRoom, // Apply new top-level properties
            players: mergedPlayers, // Use the carefully merged players
            votingData: { // Ensure votingData is also deeply merged
              ...prev.votingData,
              ...incomingRoom.votingData,
            },
            seats: incomingRoom.seats || prev.seats, // seats might be an array, replace directly or handle carefully
          };

          roomDataRef.current = newRoomData; // Always update the ref with the latest data
          return newRoomData;
        });
      }
    });

    return () => off(roomRef, 'value', unsubscribeRoom);
  }, [roomId]); // Re-run if roomId changes

  // --- Side Effects based on Player Data ---

  useEffect(() => {
    if (playerData?.wasKicked) {
      alert("You were removed from the game.");
      router.push('/join')
    }
  }, [playerData, router]); // Add router to dependencies if it could change

  // --- Return Values ---

  return {
    roomData,
    playerData,
    // Exposed functions for direct Firebase writes
    setRoomData,
    setPlayerData,
    updateRoomData,
    updatePlayerData,
    updatePlayerById,
    updateVotingData,
    handleKickPlayer,
    handleStartVote
  };
}