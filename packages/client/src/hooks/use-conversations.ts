import { IConversation, IMessage, ESender } from "@code-chat-2024/types";
import { randomBytes } from "crypto";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

export default function useConversations() {
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    function addConversation() {
        const conversation: IConversation = {
            id: randomBytes(16).toString('hex'),
            messages: [],
        };
        setConversations((prevConversations) => [...prevConversations, conversation]);
    }

    function removeConversation(conversationId: string) {
        setConversations((prevConversations) => prevConversations.filter((conversation) => conversation.id !== conversationId));
    }

    function addMessage(conversationId: string, content: string, sender: ESender) {
        const message: IMessage = {
            id: randomBytes(16).toString('hex'),
            content,
            sender,
        };
        setConversations((prevConversations) => {
            return prevConversations.map((conversation) => {
                if (conversation.id === conversationId) {
                    return { ...conversation, messages: [...conversation.messages, message] };
                }
                return conversation;
            });
        });
    }

    const selectedConversation = conversations.find((conversation) => conversation.id === selectedConversationId);

    useEffect(() => {
        if (selectedConversation) {
            const lastMessage = selectedConversation.messages[selectedConversation.messages.length - 1];
            if (lastMessage?.sender === ESender.User) {
                setTimeout(() => {
                    addMessage(selectedConversation.id, faker.hacker.phrase(), ESender.System);
                }, 1000);
            }
        }
    }, [selectedConversation]);

    return {
        addConversation,
        addMessage,
        conversations,
        removeConversation,
        selectedConversation,
        selectedConversationId,
        setSelectedConversationId,
    }
}