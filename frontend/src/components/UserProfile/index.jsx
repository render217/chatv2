import {
  faArrowRightFromBracket,
  faCaretDown,
  faGem,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState } from "react";
import useUIStore, { MODAL_TYPES } from "../../store/useUIStore";
import { Modal } from "../Modal";
import useClickOutside from "../../hooks/useClickOutside";
import { useAuth } from "../../context/AuthProvider";
import { api } from "../../api";
export function UserProfile() {
  const { logout, user, setUser } = useAuth();
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const openModal = useUIStore((state) => state.openModal);
  const { showMyProfile } = useUIStore((state) => state.modal_type);

  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
  });
  const handleInputChange = (name) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  let ref = useClickOutside(() => {
    setShowDropDown(false);
  });

  const onshowMyProfile = () => {
    openModal(MODAL_TYPES.MY_PROFILE);
  };

  const onEditProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.updateProfile({ username: formData.username, bio: formData.bio });

      const { payload } = data;
      setUser({
        username: payload.user?.username,
        bio: payload.user?.bio,
        email: payload.user.email,
        _id: payload.user._id,
      });
      setIsProfileEdit(false);
    } catch (error) {
      // console.log();
    }
  };
  const handleLogout = () => {
    logout();
  };
  const shortName = user?.username?.substring(0, 2)?.toUpperCase();
  const chatName = user?.username;
  return (
    <>
      <div className="relative">
        <div className="flex flex-nowrap items-center   gap-5">
          <div className="ml-1 rounded-md bg-clrBalticSea  px-2  py-1 ">{shortName}</div>
          <h3 className="overflow-ellipsis text-lg font-semibold text-clrFrenchGray">
            {chatName?.toUpperCase()}{" "}
          </h3>
          <div
            onClick={() => setShowDropDown(!showDropDown)}
            className="ml-auto cursor-pointer px-3">
            <FontAwesomeIcon icon={faCaretDown} />
          </div>
        </div>
        {showDropDown && (
          <div
            ref={ref}
            className="  absolute -right-1 -top-44 rounded-xl border border-clrShipGrey bg-clrBalticSea  px-2 py-3 ">
            <div className="mx-4 flex flex-col justify-center gap-3">
              <div
                onClick={onshowMyProfile}
                className="flex cursor-pointer items-center  gap-4 px-3 py-2 hover:rounded-xl hover:bg-clrShipGrey/20">
                <FontAwesomeIcon icon={faUserCircle} />
                <p>My Profile</p>
              </div>
              <div className="flex cursor-pointer items-center  gap-4 px-3 py-2 hover:rounded-xl hover:bg-clrShipGrey/20">
                <FontAwesomeIcon icon={faGem} />
                <p>Tweeter</p>
              </div>
              <p className="-my-1 h-0 border border-clrShipGrey"></p>
              <div
                onClick={handleLogout}
                className="flex cursor-pointer items-center  gap-4 px-3 py-2 hover:rounded-xl hover:bg-clrShipGrey/20">
                <FontAwesomeIcon className="text-clrValentineRed" icon={faArrowRightFromBracket} />
                <p className="text-clrValentineRed">Logout</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && showMyProfile && (
        <Modal>
          {isProfileEdit ? (
            <div className="z-30 grid h-[60vh] w-screen place-items-center bg-transparent">
              <div
                className="rounded-xl  bg-clrSmokyBlack px-5 py-5 max-lg:min-w-[60%] lg:w-[600px]"
                onClick={(e) => e.stopPropagation()}>
                <form className="" onSubmit={onEditProfileSubmit}>
                  <h3 className="mb-4 text-lg uppercase text-clrPorcelain">Edit My Profile</h3>
                  <input
                    className="mb-4 w-full rounded-lg  bg-clrShipGrey px-4  py-2 text-clrPearlBush"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange("username")}
                    placeholder="Enter new username"
                  />
                  <textarea
                    className="w-full resize-none rounded-lg  bg-clrShipGrey px-4 py-2 text-clrPearlBush"
                    name="bio"
                    id=""
                    cols="30"
                    rows="5"
                    value={formData.bio}
                    onChange={handleInputChange("bio")}
                    placeholder="Enter new bio"></textarea>
                  <div className="flex justify-end">
                    <button
                      onClick={onEditProfileSubmit}
                      className="mt-2 rounded-xl bg-clrClearBlue px-4 py-2 text-lg text-clrPorcelain">
                      Save profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="z-30 grid h-[60vh] w-screen place-items-center bg-transparent">
              <div
                className="rounded-xl  border bg-clrSmokyBlack px-5 py-5 max-lg:min-w-[60%] lg:w-[37.5rem]"
                onClick={(e) => e.stopPropagation()}>
                <div className="mx-auto max-w-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text=xs text-clrGunsmoke">Name</p>
                      <h3 className="mb-4 text-lg text-clrPorcelain">{user?.username}</h3>
                    </div>
                    <div>
                      <div className="ml-1 rounded-md bg-clrBalticSea px-4 py-3 text-lg uppercase text-clrPorcelain ">
                        be
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-clrGunsmoke">Bio</p>
                    <p className="mb-4  w-full rounded-lg  py-2 text-clrPearlBush">
                      {user?.bio || "-"}
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      setIsProfileEdit(true);
                      setFormData({
                        username: user?.username,
                        bio: user?.bio,
                      });
                    }}
                    className="w-fit cursor-pointer rounded-md bg-clrBalticSea px-2 py-2 text-clrPorcelain hover:bg-clrBalticSea/80">
                    Edit Profile
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
