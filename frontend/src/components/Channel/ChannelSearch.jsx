import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { ChannelSearchResult } from "./ChannelSearchResult";
import { api } from "../../api";
import { requestHandler } from "../../util";
// import { useChat } from "../../context/ChatProvider";
// import useChannelStore from "../../store/useChannelStore";
import { useChat } from "../../context/ChatProvider";

export function ChannelSearch() {
  // const [channels, setChannels] = useState([]);
  // const channels = useChannelStore((state) => state.channels);
  // const setChannels = useChannelStore((state) => state.setChannels);
  const { channels, setChannels } = useChat();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  // const [searchedChannels, setSearchedChannels] = useState([]);

  const getAllChats = async () => {
    requestHandler({
      api: async () => await api.getAllChats(),
      setLoading: setLoading,
      onSuccess: (payload) => {
        setChannels(payload);
        // setSearchedChannels(payload);
      },
      onError: (errMsg) => {
        console.log(errMsg);
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
    return channels.filter((channelItem) =>
      search ? channelItem?.chatName?.toLowerCase().includes(search) : true
    );
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

      <div>
        {loading ? (
          <p className="my-10 text-center text-xs">Searching...</p>
        ) : (
          <ChannelSearchResult results={getSearchedResult()} />
        )}
      </div>
    </div>
  );
}
