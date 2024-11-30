"use client";

import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { useToast } from "@/hooks/use-toast";

import { ChatMessage } from "@/app/types/chat";
import { cn } from "@/lib/utils";

type ChatInterfaceProps = {
  className?: string;
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setMessages(prev => [...prev, { role: "user", content: prompt }]);
    setPrompt("");
    setIsLoading(true);

    fetch("/api/openai", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    }).then(res => {
      if (!res.ok) {
        res.json().then(json => {
          toast({
            title: "Error",
            description: json?.error,
            variant: "destructive",
          });
        });
      } else {
        const reader = res?.body?.getReader();
        const decoder = new TextDecoder();
        let botResponse = "";
        setMessages(prev => [...prev, { role: "bot", content: botResponse }]);

        function readChunk() {
          reader?.read().then(({ done, value }) => {
            if (done) {
              setIsLoading(false);
              return;
            }

            const chunk = decoder.decode(value);
            botResponse += chunk;

            setMessages(prev => {
              return [...prev.slice(0, -1), { role: "bot", content: botResponse }];
            })

            readChunk();
          });
        }

        readChunk();
      }
    });
  }

  return (
    <div className={cn(
      "flex flex-col h-full items-center py-4 lg:py-8 gap-4 lg:gap-8",
      className,
    )}>
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        className="max-w-6xl w-full"
      />
      <ChatInput
        prompt={prompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
        handleSubmit={onSubmit}
        className="max-w-6xl w-full"
      />
    </div>
  );
}