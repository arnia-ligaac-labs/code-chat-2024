'use client';
import ChatWindow from "@/components/chat-window/chat-window";
import LoadingChatWindow from "@/components/chat-window/loading-chat-window";
import LoadingSidebar from "@/components/sidebar/loading-sidebar";
import Sidebar from "@/components/sidebar/sidebar";
import IConversation from "@/models/conversation";
import { randomBytes } from "crypto";
import { useEffect, useState } from "react";

/**
 *
 * Orchestrates convesation state
 * Orchestrates active convesation state
 * Splits the UI into sidebar and conversation
 */
export default function Chat() {
    const [conversations, setConversations] = useState<IConversation[] | null>(null);
    const [currentConversation, setCurrentConversation] = useState<IConversation | null>(null)

    useEffect(() => {
        // TODO: Fetch conversations. For now it is simulated.
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        delay(3000).then(() => {
            const randomConversations = Array.from({ length: 20 }, () => {
                return { "id": randomBytes(16).toString('hex') }
            });
            setConversations(randomConversations);
        });
    }, []);

    if (conversations === null) {
        // Loading Conversations
        return (
            <div className="flex flex-row h-screen">
                <div className="flex basis-1/6 bg-gray-50 items-start justify-center overflow-y-auto overflow-x-hidden">
                    <LoadingSidebar />
                </div>
                <div className="flex basis-5/6 bg-white items-center justify-center overflow-y-auto">
                    <LoadingChatWindow />
                </div>
            </div>
        )

    }

    function createNewConversation() {
        let newConversation: IConversation = {
            // "id": randomUUID.toString(), // Could have an issue with crypto on HTTP
            "id": randomBytes(16).toString('hex'),
        }
        setConversations(prevConversations => [newConversation, ...prevConversations!!])
        setCurrentConversation(newConversation)
    }

    function setCurrentConversationByID(id: string) {
        const selectedConversation: IConversation | undefined = conversations!!.find(conversation => conversation.id === id)
        if (selectedConversation) {
            setCurrentConversation(selectedConversation)
        }
    }
    console.log(`current conversation id = ${currentConversation ? currentConversation!.id : "null"}`)

    return (
        <div className="flex flex-row h-screen">
            <div className="flex basis-1/6 bg-gray-50 items-start justify-center overflow-y-auto overflow-x-hidden">
                <Sidebar
                    currentConversationID={currentConversation ? currentConversation!.id : null}
                    conversations={conversations}
                    setCurrentConversation={setCurrentConversationByID}
                    createNewConversation={createNewConversation}
                />
            </div>
            <div className="flex basis-5/6 bg-white items-center justify-center">
                {
                    currentConversation ? <ChatWindow key={`chat-window-for-${currentConversation.id}`} conversation={currentConversation} />
                        : <p>No conversation selected</p>
                }
            </div>
        </div>
    )
}

