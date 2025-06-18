import type { Timestamp } from "firebase/firestore";

export interface Player {
  id: string;
  name: string;
  isStoryteller: boolean;
  isSeated: boolean;
  seatNumber?: number;
  state?: "online" | "offline",
  role?: string; // Assigned by AI or storyteller
  last_changed?: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
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