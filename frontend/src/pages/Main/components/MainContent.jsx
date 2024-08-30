/* eslint-disable react/prop-types */

import { LoaderCircle, MessageSquare } from "lucide-react";
import { ChatList } from "../../../components";

export const MainContent = ({ selectedChannel, messages, loading }) => {
  if (!selectedChannel) {
    return (
      <div className="h-full">
        <div className="grid h-full w-full place-content-center">
          <p>Select a Channel</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid h-full w-full place-content-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  let content;

  if (messages.length === 0) {
    content = (
      <div className="grid h-full w-full place-content-center">
        <div className="flex flex-col items-center text-clrGunsmoke">
          <MessageSquare className="h-20 w-20" />
          <p>No Message yet</p>
        </div>
      </div>
    );
  }

  if (messages.length > 0) {
    content = <ChatList messages={messages} />;
  }

  return (
    <>
      <div className={`h-full `}>{content}</div>
    </>
  );
};
