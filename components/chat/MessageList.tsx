"use client";

import { Message, User } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock } from "lucide-react";
import { format } from "date-fns";

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  selectedUser: User;
}

export function MessageList({ messages, currentUser, selectedUser }: MessageListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)] p-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const isSender = message.senderId === currentUser.id;

          return (
            <div
              key={message.id}
              className={cn(
                "flex",
                isSender ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  isSender ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}
              >
                <p>{message.content}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="text-xs opacity-70">
                    {format(new Date(message.timestamp), "HH:mm")}
                  </span>
                  {isSender && (
                    <span className="text-xs">
                      {message.status === "pending" && <Clock className="w-3 h-3" />}
                      {message.status === "sent" && <Check className="w-3 h-3" />}
                      {message.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                      {message.status === "read" && (
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}