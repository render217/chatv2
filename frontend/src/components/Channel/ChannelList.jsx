/* eslint-disable react/prop-types */
import { ChannelItem } from "./ChannelItem";

export function ChannelList({ channels }) {
  return (
    <>
      {channels.map((channel) => (
        <ChannelItem channel={channel} key={channel?._id} />
      ))}
    </>
  );
}
