'use client';

import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

import { Player, Message } from '@/types/game';

import { TextInput } from '@/components/ui/Input';
import MessageBubble from './ui/MessageBubble';

interface ChatBoxProps {
  roomId: string | string[];
  player: Player;
}

export default function ChatBox({ roomId, player }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);

  // auto scroll bottom
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(db, `rooms/${roomId}/chat`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const messagesObj = snapshot.val() || {};
      const messages = Object.values(messagesObj) as Message[];
      setChat(messages.sort((a, b) => a.timestamp - b.timestamp));
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const messageId = crypto.randomUUID()
    const newMessage: Message = {
      id: messageId,
      senderId: player.id,
      senderName: player.name,
      text: message,
      timestamp: Date.now()
    }

    const messageRef = ref(db, `rooms/${roomId}/chat`);
    await push(messageRef, newMessage);

    setMessage('');
  };

  return (
    <div className="p-2 w-full">
      <div className="h-[300px] w-[400px] custom-scrollbar overflow-y-scroll mb-2 p-1">
        {chat.map((msg, idx) => (
          <div key={idx} className="flex flex-row w-full gap-1 mb-1 text-sm">
            <MessageBubble text={msg.text} sender={msg.senderId == player.id} senderName={msg.senderName} />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <TextInput
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
        placeholder="Type a message..."
      />
    </div>
  );
}
