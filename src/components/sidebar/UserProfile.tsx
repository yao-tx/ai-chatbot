"use client";

import Image from "next/image";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type UserProfileProps = {
  name: string;
  email: string;
  avatar: string;
}

export function UserProfile({ name, email, avatar }: UserProfileProps) {
  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <Image
        src={avatar}
        alt={`${name}'s profile picture`}
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="flex flex-col truncate">
        <p className="text-sm truncate">{name}</p>
        <span className="text-xs text-muted-foreground truncate">{email}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        aria-label="Sign out"
      >
        <LogOut className="w-4 h-4" />
        <span className="sr-only">Sign out</span>
      </Button>
    </div>
  );
}
