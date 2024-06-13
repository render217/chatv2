/* eslint-disable no-unused-vars */
import { MainHeader } from "./components/MainHeader";
import { MainContent } from "./components/MainContent";
import { MainBottom } from "./components/MainBottom";
import { useEffect, useState } from "react";
import useChannelStore from "../../store/useChannelStore";
import { api } from "../../api";
import { requestHandler } from "../../util";
import { useSocket } from "../../context/SocketProvider";
import { useChat } from "../../context/ChatProvider";
import useMessageStore from "../../store/useMessageStore";
import { chatEnum } from "../../util/constants";
import { useAuth } from "../../context/AuthProvider";
export const Main = () => {
  // const { socket } = useSocket();

  // const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const { socket } = useSocket();
  const { messages, setMessages } = useChat();
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { selectedChannel } = useChat();

  const getAllMessages = async () => {
    if (!selectedChannel) alert("no selected channel");
    requestHandler({
      api: async () => await api.getAllMessages(selectedChannel?._id),
      setLoading: setLoadingMessages,
      onSuccess: (payload) => {
        setMessages(payload.messages);
      },
      onError: (errMsg) => {},
    });
  };

  useEffect(() => {
    if (selectedChannel) {
      socket.emit(chatEnum.JOIN_CHANNEL_EVENT, selectedChannel?._id);
      getAllMessages();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

  const getOthersName = (user) => {
    const otherParticipant = selectedChannel?.participants?.filter(
      (participant) => participant._id !== user?._id
    )[0];
    const username = otherParticipant?.username;
    return username?.toUpperCase();
  };
  const isGroupChat = selectedChannel?.isGroupChat;
  const title = isGroupChat ? selectedChannel?.chatName : `CHAT WITH ${getOthersName(user)}`;

  return (
    <>
      <div className="flex h-full flex-col">
        <div className=" px-4 py-4 shadow-md shadow-clrSmokyBlack">
          <MainHeader title={selectedChannel ? title : ""} />
        </div>
        <div className="custom-main-scroll mb-2 mt-2 flex-1 overflow-y-auto overflow-x-hidden px-4">
          <MainContent
            selectedChannel={selectedChannel}
            loading={loadingMessages}
            messages={messages}
          />
        </div>
        <div className="px-4 py-8 ">
          <MainBottom />
        </div>
      </div>
    </>
  );
};
