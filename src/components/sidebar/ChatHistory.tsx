"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import type { ChatMessage } from "@/app/types/chat";

type ChatHistory = {
  id: string;
  title: string;
};

export function ChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);

    fetch("/api/chat/retrieve/history")
      .then((res) => {
        return res.json().then((json) => {
          if (!res.ok) {
            throw new Error(json?.error || "Something went wrong.");
          }

          return json;
        })
      })
      .then((data) => {
        const processedChatHistory = data.chat_history.map((chatSessions: {
          id: string;
          oldest_message: ChatMessage;
        }) => ({
          id: chatSessions.id,
          title: chatSessions.oldest_message.message || "Untitled Chat",
        }));

        setChatHistory(processedChatHistory);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Failed to retrieve chat history: ${error.message}`,
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      ) : (
        chatHistory.map((history) => (
          <SidebarMenuButton
            key={history.id}
            type="button"
            className="justify-start"
            asChild
          >
            <Link href={`/chat/${history.id}`}>
              <span className="truncate">{history.title}</span>
            </Link>
          </SidebarMenuButton>
        ))
      )}
    </div>
  );
}