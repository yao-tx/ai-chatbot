export type ChatMessage = {
  id?: string;
  role: "user" | "bot";
  message: string;
}

