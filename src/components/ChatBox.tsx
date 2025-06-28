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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const bottom = bottomRef.current;

    if (scrollContainer && bottom) {
      bottom.scrollIntoView({ behavior: 'smooth' });
    }
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
      <div ref={scrollContainerRef} className="h-[300px] w-[400px] custom-scrollbar overflow-y-scroll mb-2 p-1">
        {chat.map((msg, idx) => (
          <div key={idx} className="flex flex-row w-full gap-1 mb-1">
            <MessageBubble text={msg.text} sender={msg.senderId == player.id} senderName={msg.senderName} />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className='w-full flex items-center gap-2 px-2'>
        <TextInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          className='flex-grow'
          placeholder="Type a message..."
        />
        <svg 
          onClick={() => sendMessage()}
          className='cursor-pointer' 
          width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.52376 31.2179V25.2328C9.52376 24.5574 10.1808 24.0771 10.8244 24.2822L17.7097 26.476C18.5445 26.742 18.6556 27.878 17.888 28.3006L11.0027 32.0918C10.3378 32.458 9.52376 31.9769 9.52376 31.2179Z" fill="#F3ECDC"/>
          <path d="M11.3852 21.3187C11.0281 21.6874 10.4907 21.8177 10.0043 21.6536L2.6643 19.1766C0.588648 18.4441 0.410211 15.578 2.37897 14.5936L29.0279 1.26912C30.8964 0.334858 33.0169 1.97405 32.5834 4.01765L28.148 24.9275C27.839 26.3838 26.3315 27.247 24.9192 26.7762L14.7175 23.368C14.0313 23.1388 13.8096 22.2783 14.2996 21.746L22.5388 12.7948C23.0833 12.1729 23.485 11.5192 22.8631 10.9748C22.2412 10.4303 21.4275 10.8907 20.883 11.5126L11.3852 21.3187Z" fill="#F3ECDC"/>
          <path d="M9.52376 31.2179V25.2328C9.52376 24.5574 10.1808 24.0771 10.8244 24.2822L17.7097 26.476C18.5445 26.742 18.6556 27.878 17.888 28.3006L11.0027 32.0918C10.3378 32.458 9.52376 31.9769 9.52376 31.2179Z" stroke="black" strokeWidth="2"/>
          <path d="M11.3852 21.3187C11.0281 21.6874 10.4907 21.8177 10.0043 21.6536L2.6643 19.1766C0.588648 18.4441 0.410211 15.578 2.37897 14.5936L29.0279 1.26912C30.8964 0.334858 33.0169 1.97405 32.5834 4.01765L28.148 24.9275C27.839 26.3838 26.3315 27.247 24.9192 26.7762L14.7175 23.368C14.0313 23.1388 13.8096 22.2783 14.2996 21.746L22.5388 12.7948C23.0833 12.1729 23.485 11.5192 22.8631 10.9748C22.2412 10.4303 21.4275 10.8907 20.883 11.5126L11.3852 21.3187Z" stroke="black" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );
}
