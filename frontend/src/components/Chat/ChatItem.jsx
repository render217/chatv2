import { useAuth } from "../../context/AuthProvider";
import { twMerge } from "tailwind-merge";
import { formatDate } from "../../util";
/* eslint-disable react/prop-types */
export function ChatItem({ message }) {
  const { user } = useAuth();
  if (!message?.sender) {
    return null;
  }
  const shortName = message?.sender ? message.sender.username.substring(0, 2).toUpperCase() : null;
  const time = formatDate(message?.updatedAt);
  const fullName = message?.sender
    ? message.sender.username.charAt(0).toUpperCase() + message.sender.username.substring(1)
    : null;

  const isUser = user._id.toString() === message.sender._id.toString();
  return (
    <>
      <div className="mb-5">
        <div
          className={twMerge(
            `${isUser ? "flex-row-reverse" : "flex-row"} `,
            "flex items-start gap-3 py-3 "
          )}>
          <div className="ml-1  rounded-md bg-clrSmokyBlack px-3  py-2 text-sm">{shortName}</div>
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
