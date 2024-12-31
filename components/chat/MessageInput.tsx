"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Paperclip, Send, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "./EmojiPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'file' | 'video') => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
}

export function MessageInput({ 
  onSendMessage, 
  onStartTyping, 
  onStopTyping, 
  disabled 
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage("");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleKeyPress = useCallback(() => {
    onStartTyping();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(onStopTyping, 1000);
  }, [onStartTyping, onStopTyping]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const type = file.type.startsWith('image/') 
          ? 'image' 
          : file.type.startsWith('video/') 
          ? 'video' 
          : 'file';
        onSendMessage(reader.result as string, type);
      };
      reader.readAsDataURL(file);
    }
  }, [onSendMessage]);

  return (
    <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,video/*,application/*"
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-primary hover:bg-accent/50"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start"
            side="top"
          >
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary hover:bg-accent/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-accent/50"
          />
        </div>

        {message.trim() ? (
          <Button 
            type="submit" 
            disabled={disabled}
            className="bg-violet-600 hover:bg-violet-700 transition-all"
          >
            <Send className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "text-muted-foreground hover:text-primary hover:bg-accent/50",
              isRecording && "text-red-500"
            )}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className={cn("w-5 h-5", isRecording && "animate-pulse")} />
          </Button>
        )}
      </form>
    </div>
  );
}