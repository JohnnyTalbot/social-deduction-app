import type { Timestamp } from "firebase/firestore";

export interface Player {
  id: string;
  name: string;
  isStoryteller: boolean;
  model?: string;
  isSeated: boolean;
  seatNumber?: number;
  loadState?: "loading" | "ready" | "offline";
  state?: "online" | "offline",
  role?: string;
  last_changed?: number;
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
  players: { [playerId: string]: Player }; // Denormalized for easier display, or use subcollection
  seats: Seat[];
  // For AI tips
  currentRound: number;
  currentPhase: "day" | "night" | "voting" | "setup";
  // Store generated roles if needed
  generatedRoles?: Role[];
}