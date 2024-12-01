import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

export const metadata: Metadata = {
  title: "AI Chatbot | New Chat",
  description: "Start a new chat with AI Chatbot about anything under the sun.",
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen flex flex-col relative">
        <SidebarTrigger className="absolute top-0 left-0 p-4" />
        {children}
        <Toaster />
      </main>
    </SidebarProvider>
  );
}