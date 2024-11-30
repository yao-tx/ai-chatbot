"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { useState, useRef, Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";

const MAX_TEXTAREA_HEIGHT = 150;

type ChatInputProps = {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  className?: string;
  handleSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ prompt, setPrompt, isLoading, className, handleSubmit }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!e.shiftKey && prompt.length > 0) {
        handleSubmit(e);
      } else if (e.shiftKey) {
        setPrompt(prev => {
          const newPrompt = prev + "\n";

          setTimeout(() => {
            adjustTextareaHeight();
          }, 0);

          return newPrompt;
        });
      }
    } else {
      setTimeout(() => {
        adjustTextareaHeight();
      }, 0);
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, MAX_TEXTAREA_HEIGHT);
      textareaRef.current.style.height = newHeight + "px";
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }

  return (
    <div className={cn(
      "flex flex-row gap-0 lg:gap-14 px-4",
      className,
    )}>
      <div className="flex justify-center"></div>
      <div className="w-full px-4 py-6 bg-neutral-100 rounded-2xl">
        <form onSubmit={handleSubmit}>
          <Textarea
            ref={textareaRef}
            value={prompt}
            rows={1}
            className="text-sm md:text-base w-full min-h-[auto] overflow-x-hidden resize-none border-none shadow-none focus-visible:ring-0"
            placeholder={isLoading ? "Bot is replying..." : "How can I help you?"}
            disabled={isLoading}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleTextareaKeydown}
          />
          <Button
            type="submit"
            className="mt-4 rounded-full px-3 py-5 float-right"
            disabled={isLoading || prompt.length === 0}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
