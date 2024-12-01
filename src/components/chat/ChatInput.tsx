"use client";

import { useRef, Dispatch, SetStateAction, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_TEXTAREA_HEIGHT = 150;

type ChatInputProps = {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  hasLeftPadding?: boolean;
  className?: string;
  handleSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({
  prompt,
  setPrompt,
  isLoading,
  hasLeftPadding = false,
  className = "",
  handleSubmit,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleTextareaKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!e.shiftKey && prompt.length > 0) {
        handleSubmit(e);
      } else if (e.shiftKey) {
        setPrompt(prev => {
          const newPrompt = prev + "\n";

          requestAnimationFrame(adjustTextareaHeight);

          return newPrompt;
        });
      }
    } else {
      requestAnimationFrame(adjustTextareaHeight);
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
    <div
      className={cn(
        "flex flex-row gap-0 lg:gap-14",
        className,
      )}
    >
      {hasLeftPadding && <div className="flex justify-center"></div>}
      <div className="w-full px-4 py-6 bg-neutral-100 rounded-2xl">
        <form onSubmit={handleSubmit}>
          <Textarea
            ref={textareaRef}
            value={prompt}
            rows={1}
            className="text-sm md:text-base w-full min-h-[auto] overflow-x-hidden resize-none border-none shadow-none focus-visible:ring-0"
            placeholder={isLoading ? "AI Chatbot is replying..." : "How can AI Chatbot help you today?"}
            disabled={isLoading}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleTextareaKeydown}
            aria-disabled={isLoading}
            aria-label="Chat input"
          />
          <Button
            type="submit"
            className="mt-4 rounded-full px-3 py-5 float-right"
            disabled={isLoading || prompt.length === 0}
          >
            <ArrowUp className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
