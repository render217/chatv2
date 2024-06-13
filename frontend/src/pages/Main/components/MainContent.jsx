/* eslint-disable react/prop-types */

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
        <p>loading</p>
      </div>
    );
  }

  let content;

  if (messages.length === 0) {
    content = (
      <div className="grid h-full w-full place-content-center">
        <p>No Message yet</p>
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
