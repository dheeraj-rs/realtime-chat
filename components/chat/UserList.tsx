"use client";

import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UserListProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (user: User) => void;
}

export function UserList({ users, selectedUserId, onSelectUser }: UserListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)] border-r border-accent">
      <div className="p-4 space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={cn(
              "flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all",
              "hover:bg-accent/50 backdrop-blur-sm",
              selectedUserId === user.id && "bg-accent/50 shadow-lg"
            )}
            onClick={() => onSelectUser(user)}
          >
            <div className="relative">
              <Avatar className="ring-2 ring-violet-500/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                  user.isOnline ? "bg-emerald-500" : "bg-slate-500"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {user.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}