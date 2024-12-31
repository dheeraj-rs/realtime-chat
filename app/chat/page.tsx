"use client";

import { useEffect, useState } from "react";
import { User, Message, Call } from "@/lib/types";
import { UserList } from "@/components/chat/UserList";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { CallOverlay } from "@/components/chat/CallOverlay";
import { socket, connectSocket, disconnectSocket } from "@/lib/socket";
import { MessageCircle } from "lucide-react";

// Mock current user - In a real app, this would come from authentication
const currentUser: User = {
  id: "1",
  name: "John Doe",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  isOnline: true,
  lastSeen: new Date(),
  status: 'available'
};

// Mock users with more details
const mockUsers: User[] = [
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isOnline: true,
    lastSeen: new Date(),
    status: 'available'
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isOnline: false,
    lastSeen: new Date(),
    status: 'busy'
  },
  // Add more mock users here
];

export default function ChatPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);

  useEffect(() => {
    connectSocket(currentUser.id);

    socket.on("user_status", ({ userId, isOnline, status }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isOnline, status } : user
        )
      );
    });

    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("typing", ({ userId }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, typing: true } : user
        )
      );
    });

    socket.on("stop_typing", ({ userId }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, typing: false } : user
        )
      );
    });

    socket.on("call", (call: Call) => {
      setActiveCall(call);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' | 'video') => {
    if (!selectedUser) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content,
      timestamp: new Date(),
      status: "pending",
      type,
      ...(type !== 'text' && {
        fileUrl: content,
        fileName: 'file.jpg',
        fileSize: 1024 * 1024, // 1MB
      })
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    socket.emit("message", message);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    if (!selectedUser) return;

    const call: Call = {
      id: Date.now().toString(),
      initiatorId: currentUser.id,
      receiverId: selectedUser.id,
      type,
      status: 'ringing',
      startTime: new Date()
    };

    setActiveCall(call);
    socket.emit("call", call);
  };

  const handleEndCall = () => {
    if (activeCall) {
      socket.emit("end_call", activeCall.id);
      setActiveCall(null);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chats
          </h2>
        </div>
        <UserList
          users={users}
          selectedUserId={selectedUser?.id}
          onSelectUser={setSelectedUser}
        />
      </div>
      <div className="flex-1 flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {selectedUser ? (
          <>
            <ChatHeader
              user={selectedUser}
              onVideoCall={() => handleStartCall('video')}
              onVoiceCall={() => handleStartCall('audio')}
            />
            <MessageList
              messages={messages.filter(
                (m) =>
                  (m.senderId === currentUser.id &&
                    m.receiverId === selectedUser.id) ||
                  (m.senderId === selectedUser.id &&
                    m.receiverId === currentUser.id)
              )}
              currentUser={currentUser}
              selectedUser={selectedUser}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              onStartTyping={() => socket.emit("typing", { userId: currentUser.id })}
              onStopTyping={() => socket.emit("stop_typing", { userId: currentUser.id })}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">Welcome to Chat</h3>
              <p className="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {activeCall && (
        <CallOverlay
          call={activeCall}
          user={selectedUser || mockUsers[0]}
          onEnd={handleEndCall}
        />
      )}
    </div>
  );
}