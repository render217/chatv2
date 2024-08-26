/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { ChannelMemberItem } from "./ChannelMemberItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { requestHandler } from "../../util";
import { api } from "../../api";
// import useChannelStore from "../../store/useChannelStore";
import useUIStore, { MODAL_TYPES } from "../../store/useUIStore";
import AddChannelMember from "./AddChannelMember";
import { useChat } from "../../context/ChatProvider";

export function ChannelMemberList({ participants, admin, isAdmin }) {
  const { user } = useAuth();

  // state to show selected group member profile
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // state has detail of selectedChannel
  // const selectedChannel = useChannelStore((state) => state.selectedChannel);
  const { selectedChannel, setSelectedChannel } = useChat();
  // state to track modal open for addmember
  const isModalOpen = useUIStore((state) => state.isModalOpen);

  // state to track showAddMember in the modal
  const { showAddMember } = useUIStore((state) => state.modal_type);
  // function to open the modal
  const openModal = useUIStore((state) => state.openModal);
  const closeChannel = useUIStore((state) => state.closeChannel);
  // state  for network request progress
  const [loading, setLoading] = useState(false);

  const isGroupChat = selectedChannel?.isGroupChat;

  // only admin can Add member
  const handleAddMember = () => {
    openModal(MODAL_TYPES.ADD_MEMBER);
  };

  const handleLeaveGroup = () => {
    const response = confirm("Are you sure you want to leave");
    if (!response) {
      return;
    }
    requestHandler({
      api: async () => api.leaveGroupChat(selectedChannel?._id),
      setLoading,
      onSuccess: (payload) => {
        // console.log(payload);
        closeChannel();
        setSelectedChannel(null);
      },
      onError: (errMsg) => {
        // console.log(errMsg);
      },
    });
  };

  const handleJoinGroup = () => {
    requestHandler({
      api: async () => await api.joinGroupChat(selectedChannel?._id),
      setLoading,
      onSuccess: (payload) => {
        // console.log("Channel Joined: ");
        // console.log({ payload });
        setSelectedChannel(payload);
      },
      onError: (errMsg) => {
        // console.log(errMsg);
      },
    });
  };
  const isUserMember = participants.find((u) => u._id.toString() === user._id.toString());

  return (
    <>
      <div>
        <div className="flex items-start justify-between">
          {isGroupChat && (
            <h1 className="mb-3 font-semibold text-clrPearlBush">{"Memebers".toUpperCase()}</h1>
          )}
          {isGroupChat && isAdmin && (
            <div
              className="cursor-pointer rounded-md border border-transparent px-3 duration-200 hover:border hover:border-clrShipGrey hover:bg-clrSmokyBlack/20"
              onClick={handleAddMember}>
              <FontAwesomeIcon className="text-xs" icon={faPlus} />
              <button className="  px-2 text-xs   ">Add Member</button>
            </div>
          )}
          {isGroupChat && !isAdmin && isUserMember && (
            <div
              className="cursor-pointer rounded-md border border-transparent px-3 duration-200 hover:border hover:border-clrShipGrey hover:bg-clrSmokyBlack/20"
              onClick={handleLeaveGroup}>
              <FontAwesomeIcon icon={faMinus} />
              <button className="rounded-md  px-2 text-xs  ">Leave</button>
            </div>
          )}
          {isGroupChat && !isAdmin && !isUserMember && (
            <div
              className="cursor-pointer rounded-md border border-transparent px-3 duration-200 hover:border hover:border-clrShipGrey hover:bg-clrSmokyBlack/20"
              onClick={handleJoinGroup}>
              <FontAwesomeIcon icon={faPlus} />
              <button className="rounded-md  px-2 text-xs  ">{loading ? "..." : "Join"}</button>
            </div>
          )}
        </div>
        {/* Admin */}
        <div className="flex cursor-pointer  flex-nowrap items-center gap-5 py-3  hover:bg-clrBalticSea/30">
          <div className="ml-1 rounded-md bg-clrBalticSea px-2 py-1 text-sm ">
            {admin?.username?.substring(0, 2).toUpperCase()}
          </div>
          <h3 className="overflow-ellipsis text-sm font-semibold text-clrFrenchGray">
            {admin?.username?.toUpperCase()}{" "}
          </h3>
          <div className="ml-auto mr-5">
            <FontAwesomeIcon className="text-xs text-blue-500" icon={faStar} />
          </div>
        </div>
        {/* Admin */}
        {participants.length > 0 &&
          participants.map((participant) => (
            <ChannelMemberItem
              key={participant._id}
              participant={participant}
              selectedParticipant={selectedParticipant}
              setSelectedParticipant={setSelectedParticipant}
            />
          ))}
      </div>
      {isGroupChat && isModalOpen && showAddMember && <AddChannelMember />}
    </>
  );
}
