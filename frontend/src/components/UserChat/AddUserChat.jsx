/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Modal } from "../Modal";
import UserChatForm from "./UserChatForm";
import useUIStore from "../../store/useUIStore";
import { twMerge } from "tailwind-merge";
import { requestHandler } from "../../util";
import { api } from "../../api";
import { useChat } from "../../context/ChatProvider";

export default function AddUserChat() {
  const { setChannels, setSelectedChannel } = useChat();
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const closeModal = useUIStore((state) => state.closeModal);
  const handleAddUserChatSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      alert("select a user");
      return;
    }
    await requestHandler({
      api: async () => await api.getOrCreateOneToOneChat(selectedUser?._id),
      setLoading: setSubmitting,
      onSuccess: (payload) => {
        // console.log("Add ONE-TO-ONE chat: ");
        // check if the one to one already exists;
        if (payload.alreadyExists) {
          setSelectedChannel(payload.chat);
        } else {
          setChannels((prev) => [payload.chat, ...prev]);
          setSelectedChannel(payload.chat);
        }
        closeModal();
      },
      onError: (error) => {},
    });
  };
  return (
    <Modal>
      <div className="z-30 grid h-[60vh] w-screen place-items-center bg-transparent">
        <div
          className="rounded-xl  bg-clrSmokyBlack px-5 py-5 max-lg:min-w-[60%] lg:w-[600px]"
          onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleAddUserChatSubmit} className="w-full">
            <UserChatForm selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            <div className="flex justify-end gap-2">
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
                {submitting ? "saving..." : "save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
