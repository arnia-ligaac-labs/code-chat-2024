"use client";

// shows a list of chips based on the number of conversations
// has a button to add new conversations
// has a button to set the active conversation
// the active conversation is highlighted
import React, { useState } from "react";

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.1.2/tailwind.min.css"
/>;

// Define the type for a conversation
interface Conv {
  id: number;
  name: string;
}

// Sidebar component
const Sidebar = () => {
  // State to store the conversations
  const [conversations, setConversations] = useState<Conv[]>([
    { id: 1, name: "Conversation 1" },
  ]);

  // State to track the selected conversation ID
  const [selectedConversationId, setSelectedConversationId] = useState<number>(
    conversations[0].id
  );

  // Function to add new conversation
  const addConversation = () => {
    // Create a new conversation object
    const newConversation = {
      id: conversations.length + 1,
      name: `Conversation ${conversations.length + 1}`,
    };
    // Add the new conversation to the list of conversations
    setConversations([...conversations, newConversation]);
  };

  // Function to handle conversation click
  const handleConversationClick = (conversation: Conv) => {
    // Set the selected conversation
    setSelectedConversationId(conversation.id);
    conversation.id;
  };

  return (
    <div className="grid grid-cols-12 font-rubik ">
      {/* Sidebar with conversations list */}
      <div className="col-span-3 bg-blue-900 p-3 h-screen overflow-y-auto">
        <h2 className="font-bold text-lg mb-4 text-center">
          ChatBot Arnia Labs
        </h2>
        <button
          className="w-full py-3 mb-6 bg-zinc-700 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={addConversation}
        >
          Add Conversation
        </button>
        <ul>
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className={`p-3 mb-2 rounded-md flex items-center ${
                selectedConversationId === conversation.id ? "bg-blue-700" : "bg-zinc-700"
              }`}
              onClick={() => handleConversationClick(conversation)}
              style={{ textAlign: "center" }}
            >
              <div className="rounded-full h-8 w-8 flex items-center justify-center bg-gray-200 text-gray-800 mr-3">
                {conversation.id}
              </div>
              <span className="text-gray-00">{conversation.name}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Main content area */}
      <div className="col-span-9  bg-stone-900 p-3">
        {selectedConversationId ? (
          <p>Selected Conversation ID: {selectedConversationId}</p>
        ) : (
          <p>Select a conversation to see details here.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;