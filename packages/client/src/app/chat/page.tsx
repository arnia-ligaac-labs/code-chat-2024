/**
 *
 * Orchestrates convesation state
 * Orchestrates active convesation state
 * Splits the UI into sidebar and conversation
 */
"use client"
import { useState } from "react";
import Sidebar from "@/components/sidebar/sidebar";
import ChatWindow from "@/components/chat-window/chat-window";

export interface IMessage {
  id: string;
  text: string;
}

export interface IConversation {
  id: string;
  messages: IMessage[];
}

export default function Chat() {
  const [conversations, setConversations] = useState<IConversation[]>([]); // the list of conversations
  const [activeConversation, setActiveConversation] = useState<IConversation | null>(null); // the currently active conversation

  const addConversation = () => {
    const newConversation: IConversation = {
      id: (Math.floor(Math.random()*1000)).toString(), // random bs for now
      messages: [],
    };
    setConversations(prevConversations => [...prevConversations, newConversation]);
  };

  const addMessage = (messageText: string) => {
    const newMessage: IMessage = {
      id: (Math.floor(Math.random()*1000)).toString(), // random bs for now
      text: messageText
    };
    setActiveConversation(prevActiveConversation => {
      if (prevActiveConversation) {
        return {
          ...prevActiveConversation,
          messages: [...prevActiveConversation.messages, newMessage]
        };
      }
      return prevActiveConversation;
    });
  }

  return (
    <div className="flex flex-row h-screen">
      <div className="w-1/6 bg-slate-800">
        <Sidebar conversations={conversations} addConversation={addConversation} setActiveConversation={setActiveConversation}/>
      </div>
      <div className="w-5/6 bg-slate-700"></div>
        <ChatWindow activeConversation={activeConversation} addMessage={addMessage}/>
    </div>
  );
}
