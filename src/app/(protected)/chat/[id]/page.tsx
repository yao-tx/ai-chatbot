import { Metadata } from "next";

import { ChatInterface } from "@/components/chat/ChatInterface";

export const metadata: Metadata = {
  title: "AI Chatbot | Chat History",
  description: "Chat with AI Chatbot about anything under the sun.",
};

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <ChatInterface chatId={id} />
  );
}
