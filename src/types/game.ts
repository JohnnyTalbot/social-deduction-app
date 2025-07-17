export interface Player {
  id: string;
  name: string;
  isStoryteller: boolean;
  model?: string;
  isSeated: boolean;
  seatNumber?: number;
  loadState?: "loading" | "ready" | "offline";
  state?: "online" | "offline";
  isAlive?: boolean;
  canVote?: boolean;
  isVoting?: boolean;
  role?: string;
  last_changed?: number;
  isAnimating?: boolean;
  currentAnimation?: string;
  wasKicked?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Script {
  name: string;
  description?: string;
  minimum: number;
  numberTable: {[players: number ]: number[]};
  roleList: {[name: string] : RoleType}
}

export interface RoleType {
  name: string;
  description?: string;
  color: string;
  roles: Role[];
}

export interface Role {
  name: string;
  type: string;
  description?: string;
}

export interface Seat {
  number: number;
  playerId?: string; // Player ID if occupied
  isTaken: boolean;
}

export interface Room {
  id: string; // This will be the room code
  storytellerId: string;
  storytellerName: string;
  createdAt: number;
  status: "waiting" | "in-progress" | "ended";
  players: { [playerId: string]: Player };
  seats: Seat[];
  // For AI tips
  currentRound: number;
  currentPhase: "day" | "night" | "voting" | "setup";
  votingData?: {
    phase?: "nominations" | "countdown" | "voting";
    countdown?: number;
    votes?: { [nominatedPlayerId: string]: string[] }; // list of voter IDs who voted for them
    currentNominated?: string | null;
    playerNominating?: string; // Player ID of the one nominating
    currentlyVoting?: Seat | null; // Seat of the player currently voting
  };
  // Store generated roles if needed
  generatedRoles?: Role[];
}