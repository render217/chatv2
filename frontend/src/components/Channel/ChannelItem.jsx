/* eslint-disable react/prop-types */
import { useChat } from "../../context/ChatProvider";
// import useChannelStore from "../../store/useChannelStore";
import useUIStore from "../../store/useUIStore";

export function ChannelItem({ channel }) {
  const openChannel = useUIStore((state) => state.openChannel);
  // const setSelectedChannel = useChannelStore((state) => state.setSelectedChannel);
  const { setSelectedChannel } = useChat();
  const showDetailPage = () => {
    setSelectedChannel(channel);
    openChannel();
  };
  const chatName = channel.chatName?.toUpperCase();
  const shortName = chatName.substring(0, 2).toUpperCase();

  return (
    <div
      onClick={() => showDetailPage()}
      className="flex cursor-pointer flex-nowrap items-center gap-5 py-3 hover:bg-clrBalticSea/30">
      <div className="ml-1 rounded-md bg-clrBalticSea px-2 py-1  text-sm ">{shortName}</div>
      <h3 className="overflow-ellipsis text-sm font-semibold text-clrFrenchGray">{chatName}</h3>
    </div>
  );
}
