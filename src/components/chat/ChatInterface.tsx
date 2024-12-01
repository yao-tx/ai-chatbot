"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { useToast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";

import type { ChatMessage } from "@/app/types/chat";

type ChatInterfaceProps = {
  chatId?: string;
  className?: string;
}

export function ChatInterface({ chatId, className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const abortController = new AbortController();

    fetch(`/api/chat/retrieve/${chatId}`, {
      signal: abortController.signal,
    }).then((res) => {
      return res.json().then((json) => {
        if (!res.ok) {
          throw new Error(json?.error || "unexpected error encountered, please try again later");
        }

        return json;
      })
    })
    .then((data) => {
      const parsedMessages: ChatMessage[] = data.chat_session.chat_messages;
      setMessages(() => [...parsedMessages]);

      if (parsedMessages[parsedMessages.length - 1].role === "user") {
        submitPrompt(parsedMessages[parsedMessages.length - 1].message);
      }
    })
    .catch((error) => {
      if (error.name !== "AbortError") {
        toast({
          title: "Error",
          description: `Failed to retrieve chat history: ${error.message}`,
          variant: "destructive",
        });

        router.push("/");
      }
    });

    return () => {
      abortController.abort();
    };
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessages(prev => [...prev, { role: "user", message: prompt }]);
    saveMessage({ role: "user", message: prompt });
    submitPrompt(prompt);
  };

  const submitPrompt = (prompt: string) => {
    setPrompt("");
    setIsLoading(true);

    fetch("/api/openai", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then(json => {
            throw new Error(json?.error || "unexpected error encountered, please try again later");
          });
        } else {
          const reader = res?.body?.getReader();
          const decoder = new TextDecoder();
          let botResponse = "";
          setMessages(prev => [...prev, { role: "bot", message: botResponse }]);

          function readChunk() {
            reader?.read().then(({ done, value }) => {
              if (done) {
                saveMessage({ role: "bot", message: botResponse });
                return;
              }

              const chunk = decoder.decode(value);
              botResponse += chunk;

              setMessages(prev => {
                return [...prev.slice(0, -1), { role: "bot", message: botResponse }];
              })

              readChunk();
            });
          }

          readChunk();
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `failed to submit message to chat bot: ${error.message}`,
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  };

  const saveMessage = (chatMessage: ChatMessage) => {
    fetch(`/api/chat/save/${chatId}`, {
      method: "POST",
      body: JSON.stringify({ message: chatMessage }),
    });
  }

  return (
    <div className={cn(
      "flex flex-col h-full shrink-1 items-center py-4 lg:py-8 gap-4 lg:gap-8",
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
        hasLeftPadding={true}
        handleSubmit={onSubmit}
        className="max-w-6xl w-full px-4 xl:px-0"
      />
    </div>
  );
}