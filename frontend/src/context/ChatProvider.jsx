/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthProvider";
import { chatEnum } from "../util/constants";
import useChannelStore from "../store/useChannelStore";
import useUIStore from "../store/useUIStore";

const ChatContext = createContext({
  channels: [],
  setChannels: () => {},
  //
  selectedChannel: {},
  setSelectedChannel: () => {},
  //
  messages: [],
  setMessages: () => {},
  //
  unreadMessages: [],
  setUnreadMessages: () => {},
});

export const useChat = () => useContext(ChatContext);

export default function ChatProvider({ children }) {
  // const selectedChannel = useChannelStore((state) => state.selectedChannel);

  const { socket } = useSocket();
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([[]]);
  const closeChannel = useUIStore((state) => state.closeChannel);

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  const onMessageReceived = (newMessage) => {
    if (selectedChannel?._id === newMessage?.chat) {
      setMessages((prev) => [...prev, newMessage]);
    }
  };
  const onNewChannel = (newChannel) => {
    console.log("newChannel", newChannel);
    if (selectedChannel?._id === newChannel._id) {
      setSelectedChannel(newChannel);
      setChannels((prev) => [...prev.map((c) => (c._id === newChannel._id ? newChannel : c))]);
    }
    if (channels.find((c) => c._id === newChannel._id)) {
      setChannels((prev) => [...prev.map((c) => (c._id === newChannel._id ? newChannel : c))]);
    } else {
      setChannels((prev) => [newChannel, ...prev]);
    }
  };
  const onUpdateChannel = (updatedChannel) => {
    setChannels((prev) => [
      ...prev.map((channel) => (channel._id === updatedChannel._id ? updatedChannel : channel)),
    ]);
    if (selectedChannel._id === updatedChannel._id) {
      setSelectedChannel(updatedChannel);
    }
  };
  const onLeaveChannel = (updatedChannel) => {
    console.log("oldChannel", updatedChannel);
    setChannels((prev) => [
      ...prev.map((channel) => (channel._id === updatedChannel._id ? updatedChannel : channel)),
    ]);
    if (selectedChannel?._id === updatedChannel._id) {
      setSelectedChannel(updatedChannel);
    }
    if (updatedChannel?.participants.find((participantId) => participantId === user._id)) {
      //
    }
  };
  const onDeleteChannel = (oldChannel) => {
    setChannels((prev) => [...prev.filter((c) => c._id !== oldChannel._id)]);
    if (selectedChannel._id === oldChannel._id) {
      setSelectedChannel(null);
      closeChannel();
    }
  };
  const onBeingRemoved = (channel) => {
    if (selectedChannel?._id === channel._id) {
      setSelectedChannel(null);
      setMessages([]);
      setChannels((prev) => [...prev.filter((c) => c._id !== channel._id)]);
      closeChannel();
    } else {
      setChannels((prev) => [...prev.filter((c) => c._id !== channel._id)]);
    }
  };

  useEffect(() => {
    // If the socket isn't initialized, we don't set up listeners.
    if (!socket) return;
    // console.log("socket:", socket);
    //
    socket.on(chatEnum.CONNECTED_EVENT, onConnect);
    socket.on(chatEnum.DISCONNECT_EVENT, onDisconnect);
    //
    socket.on(chatEnum.MESSAGE_RECEIVED_EVENT, onMessageReceived);
    //
    socket.on(chatEnum.NEW_CHANNEL_EVENT, onNewChannel);
    //
    socket.on(chatEnum.UPDATE_GROUP_DETAIL_EVENT, onUpdateChannel);

    //
    socket.on(chatEnum.DELETE_CHAT_EVENT, onDeleteChannel);
    socket.on(chatEnum.LEAVE_CHANNEL_EVENT, onLeaveChannel);
    socket.on(chatEnum.REMOVE_MEMBER_EVENT, onBeingRemoved);
    //
    return () => {
      //
      socket.off(chatEnum.CONNECTED_EVENT, onConnect);
      socket.off(chatEnum.DISCONNECT_EVENT, onDisconnect);
      //
      socket.off(chatEnum.MESSAGE_RECEIVED_EVENT);
      //
      socket.off(chatEnum.NEW_CHANNEL_EVENT);
      //
      socket.off(chatEnum.UPDATE_GROUP_DETAIL_EVENT);
      //
      socket.off(chatEnum.DELETE_CHAT_EVENT);

      //
      socket.off(chatEnum.LEAVE_CHANNEL_EVENT);
      socket.off(chatEnum.REMOVE_MEMBER_EVENT);
    };
  }, [socket, selectedChannel, channels]);

  /**
   *
   *
   *
   */
  const value = {
    channels,
    setChannels,
    //
    selectedChannel,
    setSelectedChannel,
    //
    messages,
    setMessages,
    //
    unreadMessages,
    setUnreadMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
