import Link from "next/link";

import { BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatHistory } from "@/components/sidebar/ChatHistory";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader} from "@/components/ui/sidebar";
import { UserProfile } from "@/components/sidebar/UserProfile";

import { auth } from "@/auth";

export async function AppSidebar() {
  const session = await auth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/"
          className="flex flex-row gap-2 items-center"
          aria-label="Go to home"
        >
          <BotMessageSquare className="h-8 w-8" />
          <span className="text-xl font-bold">AI Chatbot</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <ChatHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          type="button"
          className="mb-4"
          asChild
        >
          <Link href="/" prefetch={true}>Start a new chat</Link>
        </Button>
        <UserProfile
          name={session?.user?.name ?? ""}
          email={session?.user?.email ?? ""}
          avatar={session?.user?.image ?? ""}
        />
      </SidebarFooter>
    </Sidebar>
  );
}