/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { api } from "../../api";
import { twMerge } from "tailwind-merge";
import { requestHandler } from "../../util";
import useUIStore from "../../store/useUIStore";
import { ChannelForm } from "./ChannelForm";
import { ChannelMemberForm } from "./ChannelMemberForm";
import useChannelStore from "../../store/useChannelStore";
import { useChat } from "../../context/ChatProvider";

export default function EditChannel() {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedChannel, setSelectedChannel } = useChat();
  // const selectedChannel = useChannelStore((state) => state.selectedChannel);
  // const setSelectedChannel = useChannelStore((state) => state.setSelectedChannel);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeChannel = useUIStore((state) => state.closeChannel);
  const [formData, setFormData] = useState({
    name: selectedChannel?.chatName,
    description: selectedChannel?.chatDescription,
  });

  const handleDeleteChannel = async () => {
    requestHandler({
      api: async () => await api.deleteGroupChat(selectedChannel?._id),
      setLoading,
      onSuccess: (payload) => {
        // console.log(payload);
        // alert("Successfully Deleted Channel");
        closeModal();
        closeChannel();
        setSelectedChannel(null);
      },
      onError: (errMsg) => {
        // console.log(errMsg);
      },
    });
  };
  const handleEditChannelSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      return;
    }

    requestHandler({
      api: async () => await api.updateGroupChat(selectedChannel?._id, { ...formData }),
      setLoading: setSubmitting,
      onSuccess: (payload) => {
        // console.log("Channel Updated: ");
        // console.log({ payload });
        setSelectedChannel(payload);
        alert("Successfully Updated Channel");

        closeModal();
      },
      onError: (errMsg) => {
        // console.log(errMsg);
      },
    });
  };

  return (
    <>
      <Modal>
        <div className="z-30 grid h-[60vh] w-screen place-items-center bg-transparent">
          <div
            className="rounded-xl  bg-clrSmokyBlack px-5 py-5 max-lg:min-w-[60%] lg:w-[600px]"
            onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleEditChannelSubmit} className="w-full">
              <ChannelForm type={"Edit"} data={formData} setData={setFormData} />
              {/* <ChannelMemberForm participants={participants} setParticipants={setParticipants} /> */}
              <div className="flex justify-end gap-2">
                {/* <button
                  onClick={handleDeleteChannel}
                  type="button"
                  className="text mr-auto mt-2  rounded-lg bg-clrValentineRed px-4 py-1 text-sm text-clrPorcelain">
                  Delete Channel
                </button> */}

                <button
                  onClick={closeModal}
                  type="reset"
                  className="text mt-2 w-20 rounded-lg bg-clrBalticSea px-4 py-1 text-sm text-clrPorcelain">
                  cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={twMerge(
                    `${submitting ? "bg-clrBalticSea" : "bg-clrClearBlue"}`,
                    "text mt-2 w-20 rounded-lg  px-4 py-1 text-sm text-clrPorcelain"
                  )}>
                  {submitting ? "updating..." : "update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
{
  /* <form onSubmit={handleAddChannelSubmit}>
              <h3 className="mb-4 text-lg uppercase text-clrPorcelain">New Channel</h3>
              <input
                className="mb-3 w-full rounded-lg bg-clrShipGrey  px-4 py-2  text-sm text-clrPearlBush"
                name="name"
                type="text"
                autoComplete="off"
                onChange={handleInputChange("name")}
                placeholder="Channel name"
              />
              <textarea
                className="w-full resize-none rounded-lg bg-clrShipGrey px-4 py-2 text-sm text-clrPearlBush"
                name="description"
                id=""
                cols="30"
                rows="3"
                autoComplete="off"
                onChange={handleInputChange("description")}
                placeholder="Channel Description"></textarea>

              <div className="w-full rounded-lg bg-clrShipGrey px-4 py-2 text-sm  outline-none">
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchName}
                    onChange={handleSearchName}
                    placeholder="Search username"
                    className="w-full rounded-md border-0 px-2 py-2 outline-none"
                  />
                </div>
                <div className="h-[100px] overflow-y-scroll px-2">
                  {avaliableUsers.length > 0 &&
                    searchedUsers.map((user) => (
                      <div
                        onClick={() => handleSelectUser(user)}
                        className="cursor-pointer px-2  py-2 text-clrPearlBush hover:bg-clrGunsmoke"
                        key={user._id}>
                        {user.username}
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-5 px-2 py-4">
                {selectedUsers.length > 0 &&
                  selectedUsers.map((user) => (
                    <div key={user._id} className="relative">
                      <p className="rounded-2xl bg-clrBalticSea px-3 py-1 text-xs text-white ">
                        {user.username}
                      </p>
                      <span
                        onClick={() => handleRemoveUser(user)}
                        className="absolute -right-2 -top-2 m-0 grid h-4 w-4 cursor-pointer place-content-center rounded-full bg-clrGunsmoke p-0 text-xs font-bold ">
                        x
                      </span>
                    </div>
                  ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  type="reset"
                  className="text mt-2 w-20 rounded-lg bg-clrBalticSea px-4 py-1 text-sm text-clrPorcelain">
                  cancel
                </button>
                <button
                  disabled={submitting}
                  className={twMerge(
                    `${submitting ? "bg-clrBalticSea" : "bg-clrClearBlue"}`,
                    "text mt-2 w-20 rounded-lg  px-4 py-1 text-sm text-clrPorcelain"
                  )}>
                  {submitting ? "saving..." : "save"}
                </button>
              </div>
            </form> */
}
