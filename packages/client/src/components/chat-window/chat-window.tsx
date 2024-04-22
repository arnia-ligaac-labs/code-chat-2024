// shows a list of message based on internal message state
// has a method to add new messages
// simulates replies to messages (useEffect + setTimeout)
// has a child component that holds the text input & button to add new messages
'use client';

import { randomBytes } from "crypto";
import { useEffect, useRef, useState } from "react";
import IMessage from "@/models/message";
import IConversation from "@/models/conversation";
import MessageOriginator from "@/models/message-originator";
import InputArea from "@/components/chat-window/input-area";
import MessageBubble from "@/components/chat-window/message-bubble";
import LoadingChatWindow from "@/components/chat-window/loading-chat-window";

interface ChatWindowProps {
    conversation: IConversation;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function ChatWindow({ conversation }: ChatWindowProps) {
    const [messages, setMessages] = useState<IMessage[] | null>(null)
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // TODO: Fetch messages here. For now it is simulated.
        // TODO: This effect and request will also be triggered for new conversations which would be a pointless req to the backend.
        console.log(`fetching messages for conversation: ${conversation.id}`)
        delay(3000)
            .then(() => {
                setMessages([])
            });
    }, [conversation])

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
        }
    }, [messages])

    if (messages === null) {
        return <LoadingChatWindow />
    }

    async function onSend(newMessageText: string) {
        const newMessage: IMessage = {
            "text": newMessageText,
            "id": randomBytes(16).toString('hex'),
            "origin": MessageOriginator.USER,
        }
        setMessages(prevMessages => [...prevMessages!!, newMessage])

        const responseMessage: IMessage = {
            "text": null,
            "id": randomBytes(16).toString('hex'),
            "origin": MessageOriginator.SYSTEM,
        }
        setMessages(prevMessages => [...prevMessages!!, responseMessage])

        // TODO: Post the message here. For now it is simulated.
        // Placehodler v
        async function mockRequest(message: string) {
            await delay(3000);
            return `What do you mean by: "${message}"?` // Galaxy-Brain AI™®
        }
        const responseMessageText = await mockRequest(newMessageText);
        // Placeholder ^

        setMessages(prevMessages => {
            const newResponseMessage: IMessage = {
                "text": responseMessageText,
                "id": responseMessage.id,
                "origin": MessageOriginator.SYSTEM,
            }
            return prevMessages!!.map(
                message => message.id === responseMessage.id ? newResponseMessage : message
            )
        })
    }

    const bubbles = messages.map(message => {
        return (
            <MessageBubble key={message.id} message={message} />
        );
    })

    return (
        <div className="flex flex-col w-full h-full justify-center items-center">
            <div id="chat-messages" ref={listRef} className="flex flex-col basis-11/12 w-full overflow-y-auto">{bubbles}</div>
            <div className="flex basis-1/12 w-full">
                <InputArea onSend={onSend} />
            </div>
        </div >
    );
}
