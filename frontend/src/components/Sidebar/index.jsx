import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  // faCaretDown,
  faClose,
  faPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import useUIStore, { MODAL_TYPES } from "../../store/useUIStore";
import { UserProfile } from "../UserProfile";
import { ChannelDetail } from "../Channel/ChannelDetail";
import { ChannelSearch } from "../Channel/ChannelSearch";

import AddChannel from "../Channel/AddChannel";
import { useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import AddUserChat from "../UserChat/AddUserChat";

export function Sidebar() {
  const isChannelOpen = useUIStore((state) => state.isChannelOpen);
  const closeChannel = useUIStore((state) => state.closeChannel);
  const closeSideBar = useUIStore((state) => state.closeSideBar);
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const { showAddChannel, showAddUserChat } = useUIStore((state) => state.modal_type);
  const openModal = useUIStore((state) => state.openModal);

  const [showDropDown, setShowDropDown] = useState(false);
  let ref = useClickOutside(() => {
    setShowDropDown(false);
  });

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
            <div className="relative flex items-center gap-5 ">
              <p>Channels</p>
              <div className={`md:ml-auto`}>
                <div
                  onClick={() => setShowDropDown(!showDropDown)}
                  className="ml-auto cursor-pointer px-3">
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                {showDropDown && (
                  <div
                    ref={ref}
                    className="absolute -right-1  rounded-xl border border-clrShipGrey bg-clrBalticSea  px-1 py-2 ">
                    <div className="mx-1 flex flex-col justify-center gap-3">
                      <button
                        onClick={() => openModal(MODAL_TYPES.ADD_CHANNEL)}
                        className="flex cursor-pointer items-center gap-4  px-3 py-2 text-sm hover:rounded-xl hover:bg-clrShipGrey/50">
                        <FontAwesomeIcon icon={faUserCircle} />
                        <p>Add Channel</p>
                      </button>

                      <button
                        onClick={() => openModal(MODAL_TYPES.ADD_USERCHAT)}
                        className="flex cursor-pointer items-center gap-4  px-3 py-2 text-sm hover:rounded-xl hover:bg-clrShipGrey/50">
                        <FontAwesomeIcon icon={faUserCircle} />
                        <p>Chat With User</p>
                      </button>
                    </div>
                  </div>
                )}
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
      {isModalOpen && showAddUserChat && <AddUserChat />}
    </>
  );
}
