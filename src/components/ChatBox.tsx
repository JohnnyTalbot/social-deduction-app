'use client';

import { useState, useEffect } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

import { Player, Message } from '@/types/game';

import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Input';

interface ChatBoxProps {
  roomId: string | string[];
  player: Player;
}

export default function ChatBox({ roomId, player }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);

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
    <div className="absolute left-0 p-2 border rounded w-[250px]">
      <div className="h-[200px] overflow-y-scroll border mb-2 p-1">
        {chat.map((msg, idx) => (
          <div key={idx} className="flex flex-row gap-1 mb-1 text-sm">
            {msg.senderName ? <p>{msg.senderName}:</p> : ""} <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <TextInput
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <Button text="Send" onClick={sendMessage} />
    </div>
  );
}
