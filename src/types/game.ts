import type { Timestamp } from "firebase/firestore";

export interface Player {
  id: string;
  name: string;
  isStoryteller: boolean;
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

export interface Room {
  id: string; // This will be the room code
  storytellerId: string;
  storytellerName: string;
  createdAt: number;
  status: "waiting" | "in-progress" | "ended";
  players: { [playerId: string]: Player }; // Denormalized for easier display, or use subcollection
  // For AI tips
  currentRound: number;
  currentPhase: "day" | "night" | "voting" | "setup";
  // Store generated roles if needed
  generatedRoles?: Role[];
}