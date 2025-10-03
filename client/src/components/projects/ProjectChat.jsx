// client/src/components/projects/ProjectChat.jsx

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ProjectChat({ projectId }) {
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!socket || !projectId) return;

    // 1. Join the project's room on the server
    socket.emit("join_project_room", projectId);
    console.log(`Attempting to join room: ${projectId}`);

    // 2. Listen for incoming messages
    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on("receive_message", handleReceiveMessage);

    // 3. Cleanup on component unmount
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, projectId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user) return;

    const messageData = {
      projectId,
      text: newMessage,
      sender: {
        _id: user._id,
        name: user.name,
      },
      timestamp: new Date(),
    };

    // Send message to the server
    socket.emit("send_message", messageData);

    // Add your own message to the chat immediately
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg h-96 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h3 className="font-semibold text-white">Project Chat</h3>
      </div>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender._id === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs ${
                msg.sender._id === user._id ? "bg-purple-600" : "bg-zinc-700"
              }`}
            >
              <p className="text-xs text-zinc-300">{msg.sender.name}</p>
              <p className="text-sm text-white">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-zinc-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-zinc-800 border-zinc-700"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
