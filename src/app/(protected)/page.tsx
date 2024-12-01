"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ChatInput } from "@/components/chat/ChatInput";
import { useChatHistoryStore } from "@/stores/chat-history";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { triggerRefresh } = useChatHistoryStore();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    fetch("/api/chat/new", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })
      .then(res => {
        if (res.ok && res.redirected) {
          router.push(res.url);
        } else if (!res.ok) {
          res.json().then((json) => {
            throw new Error(json?.error || "an unexpected error occurred, please try again later");
          });
        } else {
          throw new Error("an unexpected error occurred, please try again later");
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Failed to create new chat: ${error.message}`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
        setPrompt("");
        triggerRefresh();
      });
  }

  return (
    <div className="h-full inset-0 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full flex flex-col px-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4">Welcome to AI Chatbot</h1>
        <p className="text-base mb-8 text-center">Ask AI Chatbot anything under the sun.</p>
        <ChatInput
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          handleSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
