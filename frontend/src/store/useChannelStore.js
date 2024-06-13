import { create } from "zustand";
const useChannelStore = create((set) => ({
  selectedChannel: null,
  channels: [],
  setChannels: (payload) => {
    // console.log("payload", payload);
    return set(() => ({ channels: payload }));
  },
  setSelectedChannel: (payload) => set(() => ({ selectedChannel: payload })),
}));
export default useChannelStore;
