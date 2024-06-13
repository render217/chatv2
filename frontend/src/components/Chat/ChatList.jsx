import { useEffect, useRef } from "react";
import { ChatItem } from "./ChatItem";

/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
export function ChatList({ messages }) {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  // const handleDeleteMsg = (messageId) => {};
  return (
    <>
      <div className="flex min-h-full flex-col justify-end">
        {messages.map((message) => (
          <ChatItem key={message._id} message={message} />
        ))}
        <div className="h-0" ref={messageEndRef}></div>
      </div>
    </>
  );
}
