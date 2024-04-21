'use client';
import ChatWindow from "@/components/chat-window/chat-window";
import Sidebar from "@/components/sidebar/sidebar";
import IConversation from "@/models/IConversation";
import { randomUUID } from "crypto";
import { useEffect, useState } from "react";

/**
 *
 * Orchestrates convesation state
 * Orchestrates active convesation state
 * Splits the UI into sidebar and conversation
 */
export default function Chat() {
    const [conversations, setConversations] = useState<IConversation[]>([])
    const [currentConversation, setCurrentConversation] = useState<IConversation | null>(null)

    useEffect(() => {
        // Fetch conversations
        /// setConversations(...)
    }, []);

    function createNewConversation() {
        let newConversation: IConversation = {
            "id": randomUUID(),
            "messages": [],
        }
        setCurrentConversation(newConversation)
        setConversations(prevConversations => [newConversation, ...prevConversations])
    }

    return (
        <div className="flex flex-row h-screen">
            <div className="flex basis-1/6 items-center justify-center">
                <Sidebar
                    conversations={conversations}
                    setCurrentConversation={(conversation: IConversation) => setCurrentConversation(conversation)}
                    createNewConversation={createNewConversation}
                />
            </div>
            <div className="flex basis-5/6 bg-white items-center justify-center">
                {
                    currentConversation ? <ChatWindow conversation={currentConversation} />
                        : <p>No conversation selected</p>
                }
            </div>
        </div>
    )
}
