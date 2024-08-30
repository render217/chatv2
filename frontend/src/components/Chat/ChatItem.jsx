/* eslint-disable no-unused-vars */
import { useAuth } from "../../context/AuthProvider";
import { twMerge } from "tailwind-merge";
import { formatDate, requestHandler } from "../../util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { api } from "../../api";
import { useChat } from "../../context/ChatProvider";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
/* eslint-disable react/prop-types */
export function ChatItem({ message }) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const { setMessages } = useChat();
  const [showDropDown, setShowDropDown] = useState(false);

  if (!message?.sender) {
    return null;
  }

  const shortName = message?.sender ? message.sender.username.substring(0, 2).toUpperCase() : null;
  const time = formatDate(message?.updatedAt);
  const fullName = message?.sender
    ? message.sender.username.charAt(0).toUpperCase() + message.sender.username.substring(1)
    : null;

  const isUser = user?._id.toString() === message?.sender?._id.toString();

  const handleDeleteMessage = async () => {
    await requestHandler({
      api: async () => await api.deleteMessage(message?.chat, message?._id),
      setLoading: setIsDeleting,
      onSuccess: (payload) => {
        toast.success("Message deleted");
        setMessages((prev) => prev.filter((c) => c._id !== payload._id));
      },
      onError: (errMsg) => {},
    });
  };

  return (
    <>
      <div className="mb-5">
        <div
          className={twMerge(
            `${isUser ? "flex-row-reverse" : "flex-row"} `,
            "relative flex items-start gap-3 py-3"
          )}>
          <div
            onClick={() => setShowDropDown((p) => !p)}
            className="ml-1 rounded-md   bg-clrSmokyBlack px-3 py-2  text-sm hover:cursor-pointer">
            {shortName}
          </div>
          {showDropDown && isUser && (
            <div className="absolute bottom-14 ">
              {isDeleting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <FontAwesomeIcon
                  onClick={handleDeleteMessage}
                  className=" cursor-pointer text-clrValentineRed hover:scale-110"
                  icon={faTrashAlt}
                />
              )}
            </div>
          )}
          <div className="space-y-1">
            <div
              className={twMerge(
                `${isUser ? "justify-end" : "justify-start"}`,
                "flex items-center gap-2 text-clrGunsmoke"
              )}>
              <p className="text-sm font-semibold">{fullName}</p>
              <p className="text-xs">{time}</p>
            </div>
            <div>
              <p className="text-clrPearlBush">{message.content}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
