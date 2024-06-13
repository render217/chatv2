import { create } from "zustand";
export const MODAL_TYPES = {
  ADD_CHANNEL: "showAddChannel",
  ADD_USERCHAT: "showAddUserChat",
  EDIT_CHANNEL: "showEditChannel",
  ADD_MEMBER: "showAddMember",
  MY_PROFILE: "showMyProfile",
  EDIT_MY_PROFILE: "showEditMyProfile",
  USER_PROFILE: "showUserProfile",
};
const initalModalState = {
  showAddUserChat: false,
  showAddChannel: false,
  showEditChannel: false,
  showAddMember: false,
  showMyProfile: false,
  showEditMyProfile: false,
  showUserProfile: false,
};
const useUIStore = create((set) => ({
  showSideBar: false,

  isChannelOpen: false,
  isModalOpen: false,
  modal_type: initalModalState,
  openSideBar: () => set(() => ({ showSideBar: true })),
  toggleSideBar: () => set((state) => ({ showSideBar: !state.showSideBar })),
  closeSideBar: () => set(() => ({ showSideBar: false })),
  openChannel: () => set(() => ({ isChannelOpen: true })),
  closeChannel: () => {
    return set(() => ({ isChannelOpen: false }));
  },
  openModal: (type) => {
    const modal_types = selectModalType(type);
    return set(() => ({ isModalOpen: true, modal_type: modal_types }));
  },
  closeModal: () => set(() => ({ isModalOpen: false })),
}));

export default useUIStore;

function selectModalType(type) {
  switch (type) {
    case MODAL_TYPES.ADD_CHANNEL:
      return _magic(MODAL_TYPES.ADD_CHANNEL);
    case MODAL_TYPES.ADD_MEMBER:
      return _magic(MODAL_TYPES.ADD_MEMBER);
    case MODAL_TYPES.EDIT_CHANNEL:
      return _magic(MODAL_TYPES.EDIT_CHANNEL);
    case MODAL_TYPES.ADD_USERCHAT:
      return _magic(MODAL_TYPES.ADD_USERCHAT);
    case MODAL_TYPES.MY_PROFILE:
      return _magic(MODAL_TYPES.MY_PROFILE);
    case MODAL_TYPES.EDIT_MY_PROFILE:
      return _magic(MODAL_TYPES.EDIT_MY_PROFILE);
    case MODAL_TYPES.USER_PROFILE:
      return _magic(MODAL_TYPES.USER_PROFILE);
    default:
      return initalModalState;
  }
}
function _magic(key) {
  for (const k of Object.keys(initalModalState)) {
    if (k === key) {
      initalModalState[k] = true;
    } else {
      initalModalState[k] = false;
    }
  }
  return initalModalState;
}
