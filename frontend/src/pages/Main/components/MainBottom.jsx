/* eslint-disable no-unused-vars */
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState } from "react";
import useChannelStore from "../../../store/useChannelStore";
import { requestHandler } from "../../../util";
import { api } from "../../../api";
import { useChat } from "../../../context/ChatProvider";
import { useAuth } from "../../../context/AuthProvider";
import { LoaderCircle } from "lucide-react";

export const MainBottom = () => {
  const { user } = useAuth();
  const [textMsg, setTextMsg] = useState("");
  const [loading, setLoading] = useState(false);
  // const selectedChannel = useChannelStore((state) => state.selectedChannel);
  const { selectedChannel, setMessages } = useChat();

  const isParticipant = selectedChannel?.participants?.find(
    (p) => p?._id.toString() === user?._id.toString()
  );

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!textMsg) {
      return;
    }
    const chatId = selectedChannel._id;
    requestHandler({
      api: async () => await api.createMessage(chatId, { content: textMsg }),
      setLoading,
      onSuccess: (payload) => {
        setTextMsg("");
        setMessages((prev) => [...prev, payload]);
      },
      onError: (errMsg) => {
        setTextMsg("");
      },
    });
  };
  return (
    <>
      {selectedChannel && isParticipant ? (
        <div className={`max-w-md:px-0 md:px-10`}>
          <form
            onSubmit={handleMessageSubmit}
            className="flex rounded-xl  bg-clrShipGrey px-1 py-1">
            <input
              value={textMsg}
              disabled={loading}
              onChange={(e) => setTextMsg(e.target.value)}
              className="w-full bg-transparent  px-5 py-2 outline-none outline-offset-0 disabled:cursor-not-allowed  disabled:opacity-30"
              type="text"
              placeholder="Type a message here"
            />
            <button
              disabled={loading}
              className="w-[50px] rounded-lg bg-clrClearBlue  hover:bg-clrClearBlue/90 disabled:cursor-not-allowed disabled:bg-clrClearBlue/90 disabled:opacity-60">
              {loading ? (
                <LoaderCircle className="size-3 mx-auto animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} />
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className={`max-w-md:px-0 md:px-10`}>
          <form className="flex rounded-xl  bg-clrShipGrey px-1 py-1  hover:cursor-not-allowed">
            <input
              className="w-full bg-transparent  px-5 py-2 outline-none outline-offset-0  hover:cursor-not-allowed"
              type="text"
              value={""}
              disabled={true}
              placeholder="Type a message here"
            />
            <button
              disabled={true}
              className="rounded-lg  bg-clrGunsmoke px-4  hover:cursor-not-allowed">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
