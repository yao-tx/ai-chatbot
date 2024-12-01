import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chatbot | Login",
  description: "Login to your account to get started with the AI Chatbot.",
};

export default function LoginLaRyout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}
    </main>
  );
}