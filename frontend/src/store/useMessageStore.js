import { create } from "zustand";
const useMessageStore = create((set) => ({
  unreadMessages: [],
  setUnReadMessages: (payload) => {
    // console.log("unreadMessages payload", payload);
    return set(() => ({ unreadMessages: payload }));
  },
  messages: [],
  setMessages: (payload) => {
    // console.log("messages payload", payload);
    return set(() => ({ messages: payload }));
  },
}));
export default useMessageStore;
