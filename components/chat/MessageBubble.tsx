"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock, Download, File, Image, Video } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
  showAvatar?: boolean;
}

export function MessageBubble({ message, isSender, showAvatar }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false);

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative group">
            <img 
              src={message.fileUrl} 
              alt="Image" 
              className="rounded-lg max-w-[300px] cursor-pointer hover:opacity-95 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="sm" className="bg-background/80 backdrop-blur-sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="relative group rounded-lg overflow-hidden">
            <video 
              src={message.fileUrl} 
              controls 
              className="max-w-[300px]"
              poster={message.thumbnail}
            />
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center space-x-2 bg-accent/50 p-3 rounded-lg backdrop-blur-sm">
            <File className="w-8 h-8" />
            <div className="flex-1">
              <p className="font-medium">{message.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {(message.fileSize! / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        );
      default:
        return <p className="leading-relaxed">{message.content}</p>;
    }
  };

  return (
    <div
      className={cn(
        "group flex items-end space-x-2 mb-4",
        isSender ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl p-3 shadow-lg transition-all",
          isSender 
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white" 
            : "bg-accent hover:bg-accent/90"
        )}
      >
        {renderContent()}
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
                <CheckCheck className="w-3 h-3 text-blue-400" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}