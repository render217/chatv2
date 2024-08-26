/* eslint-disable no-unused-vars */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUIStore, { MODAL_TYPES } from "../../store/useUIStore";
import { Modal } from "../Modal";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import useChannelStore from "../../store/useChannelStore";
import { useAuth } from "../../context/AuthProvider";
import { api } from "../../api";
import { requestHandler } from "../../util";
import { useState } from "react";
import { useChat } from "../../context/ChatProvider";

/* eslint-disable react/prop-types */
export function ChannelMemberItem({ participant, selectedParticipant, setSelectedParticipant }) {
  const { username } = participant;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const openModal = useUIStore((state) => state.openModal);
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const { showUserProfile } = useUIStore((state) => state.modal_type);
  // const selectedChannel = useChannelStore((state) => state.selectedChannel);
  const { selectedChannel, setSelectedChannel } = useChat();
  const chatName = username?.toUpperCase();
  const shortName = chatName.substring(0, 2).toUpperCase();
  const isAdmin = selectedChannel?.admin?._id.toString() === user._id.toString();
  const isGroupChat = selectedChannel?.isGroupChat;

  const handleDelete = () => {
    const response = confirm(`Are you sure you want to remove ${username}`);
    if (!response) {
      return;
    }
    requestHandler({
      api: async () =>
        await api.removeParticipantFromGroupChat(selectedChannel?._id, participant._id),
      setLoading,
      onSuccess: (payload) => {
        // console.log("Participant Removed:");
        // console.log({ payload });
        setSelectedChannel(payload);
      },
      onError: (errMsg) => {
        // console.log(errMsg);
      },
    });
  };
  return (
    <>
      <div className="flex  flex-nowrap items-center gap-5 py-3 ">
        <div
          onClick={() => {
            setSelectedParticipant(participant);
            openModal(MODAL_TYPES.USER_PROFILE);
          }}
          className="ml-1 cursor-pointer rounded-md bg-clrBalticSea px-2 py-1 text-sm hover:bg-clrBalticSea/30 ">
          {shortName}
        </div>
        <h3 className="overflow-ellipsis text-sm font-semibold text-clrFrenchGray">{chatName} </h3>
        {isGroupChat && isAdmin && (
          <div className="ml-auto mr-3 cursor-pointer px-2" onClick={handleDelete}>
            <FontAwesomeIcon className="  text-clrValentineRed" icon={faTrashAlt} />
          </div>
        )}
      </div>
      {isModalOpen && showUserProfile && selectedParticipant && (
        <Modal>
          <div className="z-30 grid h-[60vh] w-screen place-items-center bg-transparent">
            <div
              className="rounded-xl  border bg-clrSmokyBlack px-5 py-5 max-lg:min-w-[60%] lg:w-[37.5rem]"
              onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto max-w-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text=xs text-clrGunsmoke">Name</p>
                    <h3 className="mb-4 text-lg text-clrPorcelain">
                      {selectedParticipant?.username?.toUpperCase()}
                    </h3>
                  </div>
                  <div>
                    <div className="ml-1 rounded-md bg-clrBalticSea px-4 py-3 text-lg uppercase text-clrPorcelain ">
                      {selectedParticipant?.username?.substring(0, 2)?.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-clrGunsmoke">Bio</p>
                  <p className="mb-4  w-full rounded-lg  py-2 text-clrPearlBush">
                    {selectedParticipant?.bio ?? "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
