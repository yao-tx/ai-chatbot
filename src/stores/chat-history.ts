import { create } from "zustand";

type ChatHistoryStore = {
  shouldRefresh: boolean;
  triggerRefresh: () => void;
  resetRefresh: () => void;
};

export const useChatHistoryStore = create<ChatHistoryStore>((set) => ({
  shouldRefresh: false,
  triggerRefresh: () => set({ shouldRefresh: true }),
  resetRefresh: () => set({ shouldRefresh: false }),
}));
