"use client"

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoaderPinwheel, BotMessageSquare, ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "bot";
  content: string;
}

export default function Home() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMessages: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages(updatedMessages);
    setPrompt("");
    setIsLoading(true);
    const res = fetch("/api/openai", {
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

  const handleTextareaKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.length > 0) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setPrompt(prev => {
        const newPrompt = prev + "\n";

        setTimeout(() => {
          adjustTextareaHeight();
        }, 0);

        return newPrompt;
      });
    } else {
      setTimeout(() => {
        adjustTextareaHeight();
      }, 0);
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }

  return (
    <main className="h-screen inset-0">
      <div className="flex flex-col h-full items-center">
        <ScrollArea className="flex-1 max-w-6xl w-full px-4 py-8">
          <div className="flex flex-col gap-8">
            {messages.map((msg, index) => (
              msg.role === "user" ? (
                <div
                  key={index}
                  className="bg-neutral-800 text-white py-3 px-5 rounded-3xl self-end ml-auto whitespace-pre-line"
                >
                  {msg.content}
                </div>
              ): (
                <div key={index}className="flex flex-row gap-4 items-start">
                  <div className="flex-shrink-0 border border-gray-300 rounded-full items-center justify-center p-2">
                    <BotMessageSquare className="w-5 h-5" />
                  </div>
                  <div
                    className="bg-transparent self-start w-full whitespace-pre-line"
                  >
                    {msg.content}
                  </div>
                </div>
              )
            ))}
          </div>
          <div className="flex flex-row gap-0 lg:gap-14 my-5">
            <div className="flex flex-justify-center"></div>
            {isLoading ? (
              <LoaderPinwheel className="animate-spin h-6 w-6" />
            ): (
              <LoaderPinwheel className="h-6 w-6" />
            )}
          </div>
        </ScrollArea>
        <div className="flex flex-row gap-0 lg:gap-14 max-w-6xl w-full px-4">
          <div className="flex justify-center"></div>
          <div className="w-full px-4 py-6 mb-8 bg-neutral-100 rounded-2xl">
            <form onSubmit={handleSubmit}>
              <Textarea
                ref={textareaRef}
                value={prompt}
                rows={1}
                className="text-sm md:text-base w-full min-h-[auto] overflow-hidden resize-none border-none shadow-none focus-visible:ring-0"
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
      </div>
    </main>
  );
}
