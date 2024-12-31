"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const EMOJI_CATEGORIES = {
  smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘'],
  gestures: ['👋', '🤚', '✋', '🖐️', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🎮', '🎲', '🧩', '🎭'],
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EMOJI_CATEGORIES>('smileys');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentEmojis');
    if (saved) {
      setRecentEmojis(JSON.parse(saved));
    }
  }, []);

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20);
    setRecentEmojis(newRecent);
    localStorage.setItem('recentEmojis', JSON.stringify(newRecent));
  };

  return (
    <div className="w-64 bg-background/95 backdrop-blur-lg rounded-lg shadow-2xl border border-accent p-2 transform transition-all">
      <div className="flex space-x-1 mb-2 pb-2 border-b border-accent">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <Button
            key={category}
            variant="ghost"
            size="sm"
            className={cn(
              "px-2 py-1 text-xs rounded-md transition-all",
              selectedCategory === category && "bg-accent text-accent-foreground"
            )}
            onClick={() => setSelectedCategory(category as keyof typeof EMOJI_CATEGORIES)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-48">
        <div className="grid grid-cols-6 gap-1 p-1">
          {EMOJI_CATEGORIES[selectedCategory].map((emoji) => (
            <button
              key={emoji}
              className="p-1 hover:bg-accent rounded-md transition-all hover:scale-125"
              onClick={() => handleEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>

        {recentEmojis.length > 0 && selectedCategory === 'smileys' && (
          <>
            <div className="text-xs text-muted-foreground mt-2 mb-1 px-1">Recently Used</div>
            <div className="grid grid-cols-6 gap-1 p-1">
              {recentEmojis.map((emoji) => (
                <button
                  key={emoji}
                  className="p-1 hover:bg-accent rounded-md transition-all hover:scale-125"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
}