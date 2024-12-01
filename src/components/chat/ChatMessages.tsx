"use client";

import React, { useRef, useEffect } from "react";

import { BotMessageSquare, LoaderPinwheel } from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ChatMessage } from "@/app/types/chat";

type ChatMessagesProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  className?: string;
}

export const ChatMessages = React.memo(({ messages, isLoading, className }: ChatMessagesProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaderRef.current) {
      loaderRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ScrollArea
      className={cn(
        "flex-1 px-4",
        className,
      )}
    >
      <div className="flex flex-col gap-8">
        {messages.map((message, index) => (
          message.role === "user" ? (
            <div
              key={message.id ?? index}
              className="bg-neutral-800 text-white py-3 px-5 rounded-3xl self-end ml-auto whitespace-pre-line"
            >
              {message.message}
            </div>
          ): (
            <div
              key={message.id ?? index}
              className="flex flex-row gap-4 items-start"
            >
              <div className="flex-shrink-0 border border-gray-300 rounded-full items-center justify-center p-2">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div
                className="bg-transparent self-start w-full whitespace-pre-line"
              >
                {message.message}
              </div>
            </div>
          )
        ))}
      </div>
      <div ref={loaderRef} className="flex flex-row gap-0 lg:gap-14 my-5">
        <div className="flex flex-justify-center"></div>
        {isLoading ? (
          <LoaderPinwheel className="animate-spin h-6 w-6" />
        ): (
          <LoaderPinwheel className="h-6 w-6" />
        )}
      </div>
    </ScrollArea>
  );
});