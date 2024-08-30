/* eslint-disable no-unused-vars */
import { useState } from "react";
import { ChannelMemberForm } from "./ChannelMemberForm";
import { Modal } from "../Modal";
import useUIStore from "../../store/useUIStore";
import { twMerge } from "tailwind-merge";
import useChannelStore from "../../store/useChannelStore";
import { requestHandler } from "../../util";
import { api } from "../../api";
import { useChat } from "../../context/ChatProvider";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function AddChannelMember() {
  const [submitting, setSubmitting] = useState(false);

  const [participants, setParticipants] = useState([]);
  const { selectedChannel, setSelectedChannel } = useChat();
  // const selectedChannel = useChannelStore((state) => state.selectedChannel);
  // console.log("sync", participants);
  const closeModal = useUIStore((state) => state.closeModal);

  const handleAddChannelMemberSubmit = async (e) => {
    e.preventDefault();
    // console.log("participants", participants);
    if (participants.length === 0) {
      return;
    }

    requestHandler({
      api: async () => api.addNewParticipantsInGroupChat(selectedChannel?._id, { participants }),
      setLoading: setSubmitting,
      onSuccess: (payload) => {
        // console.log("Participant Added: ");
        // console.log({ payload });
        setSelectedChannel(payload);
        toast.success("Successfully Added Participants");
        closeModal();
      },
      onError: (errMsg) => {
        if (errMsg) {
          toast.error(errMsg || "Something went wrong");
        }
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
            <form onSubmit={handleAddChannelMemberSubmit} className="w-full">
              <ChannelMemberForm
                participants={participants}
                setParticipants={setParticipants}
                editMode={true}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  disabled={submitting}
                  type="reset"
                  className="text mt-2 w-20 rounded-lg bg-clrBalticSea px-4 py-1 text-sm text-clrPorcelain disabled:cursor-not-allowed disabled:opacity-60">
                  cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || participants.length === 0}
                  className={twMerge(
                    "text mt-2 w-20 rounded-lg bg-clrClearBlue  px-4 py-1 text-sm text-clrPorcelain disabled:cursor-not-allowed disabled:opacity-60"
                  )}>
                  {submitting ? <LoaderCircle className="mx-auto h-5 w-5 animate-spin" /> : "add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
