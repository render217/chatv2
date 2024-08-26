/* eslint-disable no-unused-vars */
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import useChannelStore from "../../store/useChannelStore";
import useUIStore, { MODAL_TYPES } from "../../store/useUIStore";
import { ChannelMemberList } from "./ChannelMemeberList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthProvider";
import EditChannel from "./EditChannel";
import AddChannelMember from "./AddChannelMember";
import { requestHandler } from "../../util";
import { api } from "../../api";
import { useState } from "react";
import { useChat } from "../../context/ChatProvider";

export function ChannelDetail() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  // const selectedChannel = useChannelStore((state) => state.selectedChannel);
  const { selectedChannel, setSelectedChannel, setChannels } = useChat();

  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const { showEditChannel, showAddMember } = useUIStore((state) => state.modal_type);

  const isChannelOpen = useUIStore((state) => state.isChannelOpen);
  const closeChannel = useUIStore((state) => state.closeChannel);

  const openModal = useUIStore((state) => state.openModal);

  if (!isChannelOpen || !selectedChannel) {
    closeChannel();
  }

  const isGroupChat = selectedChannel?.isGroupChat;
  const getOthersName = (user) => {
    const otherParticipant = selectedChannel?.participants?.filter(
      (participant) => participant._id !== user?._id
    )[0];
    const username = otherParticipant?.username;
    return username?.toUpperCase();
  };
  const detail = {
    _id: selectedChannel._id,
    chatName: isGroupChat ? selectedChannel.chatName : getOthersName(user),
    chatDescription: isGroupChat ? selectedChannel.chatDescription : "",
    participants: selectedChannel.participants.filter((p) => p._id !== selectedChannel.admin._id),
    admin: selectedChannel.admin,
  };

  const isAdmin = user._id.toString() === selectedChannel.admin._id.toString();
  const handleDelete = () => {
    const response = confirm("Are you sure");

    if (!response) {
      return;
    }
    requestHandler({
      api: async () => await api.deleteGroupChat(selectedChannel?._id),
      setLoading: setLoading,
      onSuccess: (payload) => {
        // console.log("Channel Deleted: ");
        // console.log({ payload });
        alert("Successfully deleted");
        setChannels((prev) => [...prev.filter((p) => p?._id !== payload?._id)]);
        setSelectedChannel(null);
        closeChannel();
      },
      onError: (errMsg) => {
        // console.log(errMsg);
      },
    });
  };

  const handleSingleChatDelete = () => {
    const response = confirm("Are you sure");
    if (!response) return;

    requestHandler({
      api: async () => await api.deleteOneToOneChat(selectedChannel?._id),
      setLoading: setLoading,
      onSuccess: (payload) => {
        // console.log("delete onetooneChat payload", payload);
        alert("Successfully deleted");
        setSelectedChannel(null);
        closeChannel();
      },
      onError: (errMsg) => {
        // console.log(errMsg);
      },
    });
  };

  return (
    <>
      <div className="py-4">
        <div className="mb-2 flex items-center justify-between ">
          <h2 className="  font-semibold text-clrPearlBush">
            {isGroupChat ? detail.chatName.toUpperCase() : `${detail.chatName.toUpperCase()}`}
          </h2>
        </div>

        {isGroupChat && isAdmin && (
          <div className=" mb-4  flex">
            <div
              className="cursor-pointer rounded-md border border-transparent px-3 duration-200 hover:border hover:border-clrShipGrey hover:bg-clrSmokyBlack/20"
              onClick={() => {}}>
              <FontAwesomeIcon className="text-xs" icon={faEdit} />
              <button className="px-1 text-xs" onClick={() => openModal(MODAL_TYPES.EDIT_CHANNEL)}>
                Edit Channel
              </button>
            </div>
            <div
              className="cursor-pointer rounded-md border border-transparent px-3 duration-200 hover:border hover:border-clrShipGrey hover:bg-clrSmokyBlack/20"
              onClick={() => {}}>
              <FontAwesomeIcon className="text-xs text-clrValentineRed" icon={faEdit} />
              <button className="px-1 text-xs text-clrValentineRed" onClick={handleDelete}>
                Delete Channel
              </button>
            </div>
          </div>
        )}

        {isGroupChat && <p className="mb-4 text-sm text-clrPearlBush">{detail.chatDescription}</p>}
        <ChannelMemberList
          participants={detail.participants}
          admin={detail.admin}
          isAdmin={isAdmin}
        />
        {!isGroupChat && isAdmin && (
          <button
            onClick={handleSingleChatDelete}
            className="mt-10 w-full rounded-md bg-red-500 py-2 text-white hover:bg-red-600">
            Delete Chat
          </button>
        )}
      </div>
      {isGroupChat && isModalOpen && showEditChannel && <EditChannel />}
    </>
  );
}
