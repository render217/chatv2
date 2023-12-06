import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import useUIStore, { MODAL_TYPES } from "../../store/useUIStore";
import { UserProfile } from "../UserProfile";
import { ChannelDetail } from "../Channel/ChannelDetail";
import { ChannelSearch } from "../Channel/ChannelSearch";

import AddChannel from "../Channel/AddChannel";

export function Sidebar() {
  const isChannelOpen = useUIStore((state) => state.isChannelOpen);
  const closeChannel = useUIStore((state) => state.closeChannel);
  const closeSideBar = useUIStore((state) => state.closeSideBar);
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const { showAddChannel } = useUIStore((state) => state.modal_type);
  const openModal = useUIStore((state) => state.openModal);

  const closeShowDropDown = () => {};

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className=" px-4 py-3 shadow-md shadow-clrNight">
          {isChannelOpen ? (
            <div className="flex items-center justify-between">
              <p onClick={closeChannel} className="py-1">
                <FontAwesomeIcon icon={faArrowLeftLong} />
              </p>
              <div className={` ml-auto hidden max-md:block `}>
                <button
                  className="rounded-md   px-2 py-1 text-white  transition-colors duration-300 hover:bg-clrBalticSea"
                  onClick={closeSideBar}>
                  <FontAwesomeIcon icon={faClose} className="bg-transparent" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5 ">
              <p>All Channels</p>
              <div className={`md:ml-auto`}>
                <button
                  className=" rounded-md bg-clrBalticSea px-2 py-1 text-white hover:bg-clrBalticSea/50"
                  onClick={() => openModal(MODAL_TYPES.ADD_CHANNEL)}>
                  <FontAwesomeIcon icon={faPlus} className="bg-tranparent" />
                </button>
              </div>
              <div className={` ml-auto hidden max-md:block `}>
                <button
                  className="rounded-md   px-2 py-1 text-white  transition-colors duration-300 hover:bg-clrBalticSea"
                  onClick={closeSideBar}>
                  <FontAwesomeIcon icon={faClose} className="bg-transparent" />
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Sidebar Header */}

        {/* Sidebar Body */}
        <div
          className="custom-sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-4"
          onClick={closeShowDropDown}>
          {isChannelOpen ? (
            <div>
              <ChannelDetail />
            </div>
          ) : (
            <div>
              <ChannelSearch />
            </div>
          )}
        </div>
        {/* Sidebar Body */}

        {/* Sidebar Bottom */}
        <div className="border-t border-clrBalticSea bg-clrNight py-4 shadow-md shadow-clrNight">
          <div className="px-4">
            <UserProfile />
          </div>
        </div>
        {/* Sidebar Bottom */}
      </div>
      {isModalOpen && showAddChannel && <AddChannel />}
    </>
  );
}
