"use client";

import { Call, User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CallOverlayProps {
  call: Call;
  user: User;
  onEnd: () => void;
}

export function CallOverlay({ call, user, onEnd }: CallOverlayProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative">
          {call.type === 'video' && !isVideoOff ? (
            <div className="w-[640px] h-[480px] bg-secondary rounded-xl overflow-hidden">
              {/* Video stream would go here */}
              <div className="absolute bottom-4 right-4 w-32 h-24 bg-muted rounded-lg">
                {/* Local video preview */}
              </div>
            </div>
          ) : (
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          )}
        </div>

        <h2 className="mt-4 text-2xl font-semibold">{user.name}</h2>
        <p className="text-muted-foreground">
          {call.status === 'ringing' ? 'Calling...' : 
           call.status === 'ongoing' ? 'On call' : 'Call ended'}
        </p>

        <div className="mt-8 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12",
              isMuted && "bg-red-500/10 text-red-500"
            )}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full w-16 h-16"
            onClick={onEnd}
          >
            <PhoneOff className="w-8 h-8" />
          </Button>

          {call.type === 'video' && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full w-12 h-12",
                isVideoOff && "bg-red-500/10 text-red-500"
              )}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? (
                <VideoOff className="w-6 h-6" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}