/* eslint-disable no-unused-vars */
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState } from "react";
import useChannelStore from "../../../store/useChannelStore";
import { requestHandler } from "../../../util";
import { api } from "../../../api";
import { useChat } from "../../../context/ChatProvider";

export const MainBottom = () => {
  const [textMsg, setTextMsg] = useState("");
  const [loading, setLoading] = useState(false);
  // const selectedChannel = useChannelStore((state) => state.selectedChannel);
  const { selectedChannel, setMessages } = useChat();
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
        console.log(errMsg);
        setTextMsg("");
      },
    });
  };
  return (
    <>
      {selectedChannel ? (
        <div className={`max-w-md:px-0 md:px-10`}>
          <form
            onSubmit={handleMessageSubmit}
            className="flex rounded-xl  bg-clrShipGrey px-1 py-1">
            <input
              value={textMsg}
              onChange={(e) => setTextMsg(e.target.value)}
              className="w-full bg-transparent  px-5 py-2 outline-none outline-offset-0"
              type="text"
              placeholder="Type a message here"
            />
            <button className="rounded-lg  bg-clrClearBlue px-4 hover:bg-clrClearBlue/90">
              <FontAwesomeIcon icon={faPaperPlane} />
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
