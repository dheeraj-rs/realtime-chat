"use client";

import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  user: User;
  onVideoCall: () => void;
  onVoiceCall: () => void;
}

export function ChatHeader({ user, onVideoCall, onVoiceCall }: ChatHeaderProps) {
  return (
    <div className="gradient-header p-4 border-b backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-violet-500/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background
                ${user.status === 'available' ? 'bg-emerald-500' : 
                  user.status === 'busy' ? 'bg-rose-500' : 
                  user.status === 'away' ? 'bg-amber-500' : 'bg-slate-500'
                }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">{user.name}</h3>
            <p className="text-sm text-violet-200/80">
              {user.typing ? 'Typing...' : user.status}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onVoiceCall}
            className="hover:bg-violet-500/20 text-violet-200"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onVideoCall}
            className="hover:bg-violet-500/20 text-violet-200"
          >
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-violet-500/20 text-violet-200">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Search Messages</DropdownMenuItem>
              <DropdownMenuItem>Clear Chat</DropdownMenuItem>
              <DropdownMenuItem className="text-rose-500">Block User</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}