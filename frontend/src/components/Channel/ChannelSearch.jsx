/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { ChannelSearchResult } from "./ChannelSearchResult";
import { api } from "../../api";
import { requestHandler } from "../../util";
// import { useChat } from "../../context/ChatProvider";
// import useChannelStore from "../../store/useChannelStore";
import { useChat } from "../../context/ChatProvider";
import { LoaderCircle } from "lucide-react";
const TAB_OPTIONS = [
  { id: "all", label: "All" },
  { id: "single", label: "Single" },
  { id: "group", label: "Group" },
];
export function ChannelSearch() {
  // const [channels, setChannels] = useState([]);
  // const channels = useChannelStore((state) => state.channels);
  // const setChannels = useChannelStore((state) => state.setChannels);
  const { channels, setChannels } = useChat();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchedChannels, setSearchedChannels] = useState([]);

  const getAllChats = async () => {
    await requestHandler({
      api: async () => await api.getAllChats({ type: selectedTab }),
      setLoading: setLoading,
      onSuccess: (payload) => {
        setChannels(payload);
        setSearchedChannels(payload);
        // console.log("get all chats", payload);
      },
      onError: (errMsg) => {
        // console.log(errMsg);
      },
    });
  };
  useEffect(() => {
    getAllChats();
  }, []);

  const handleInputChange = (e) => {
    setSearch(e.target.value.toLowerCase());
    // if (e.target.value) {
    //   const regexPattern = new RegExp(e.target.value.trim().toLowerCase());
    //   let result = channels.filter((ch) => ch.chatName.toLowerCase()?.match(regexPattern));
    //   setSearchedChannels(result);
    // } else {
    //   setSearchedChannels(channels);
    // }
  };
  const getSearchedResult = () => {
    return channels
      .filter((channelItem) =>
        search ? channelItem?.chatName?.toLowerCase().includes(search) : true
      )
      .filter((channel) =>
        selectedTab === "all"
          ? true
          : selectedTab === "group"
          ? channel?.isGroupChat === true
          : channel?.isGroupChat === false
      );
  };

  const onTabSelect = (tabId) => {
    setSelectedTab(tabId);

    // console.log("tabId: ", tabId, " selected");
  };
  return (
    <div className="py-4">
      <div className="flex items-center rounded-md bg-clrShipGrey px-2 py-2">
        <FontAwesomeIcon icon={faSearch} />
        <input
          value={search}
          onChange={(e) => handleInputChange(e)}
          className="w-full border-none bg-transparent pl-4 text-lg outline-0 outline-offset-0"
          type="text"
          placeholder="search"
        />
      </div>
      <div className="items-centers my-3 flex gap-2 border-y-2 border-y-clrPearlBush/20 py-2">
        {TAB_OPTIONS.map((tab) => {
          const { id, label } = tab;
          const isSelected = id === selectedTab;
          return (
            <Tab isSelected={isSelected} key={id} id={id} label={label} onClick={onTabSelect} />
          );
        })}
      </div>
      <div>
        {loading ? (
          <div className="my-10 text-center text-xs">
            <LoaderCircle className="mx-auto animate-spin" />
          </div>
        ) : (
          <ChannelSearchResult results={getSearchedResult()} />
        )}
      </div>
    </div>
  );
}

function Tab({ label, onClick, id, isSelected }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`${
        isSelected ? "bg-clrShipGrey" : "bg-clrBalticSea"
      } flex-1 rounded-md  p-1 text-center text-sm text-clrPearlBush/80 transition-all duration-300 hover:bg-clrShipGrey`}>
      {label}
    </button>
  );
}
