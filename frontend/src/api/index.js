import axios from "axios";
import Cookies from "js-cookie";
// const client = axios.create({
//   baseURL: "http://localhost:3500/api",
// });
const BASEURL = import.meta.env.VITE_BACKEND_URI;
let http = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
});

// Add a request interceptor
http.interceptors.request.use(
  function (config) {
    const token = Cookies.get("chat_token") ?? "";

    config.headers = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// AUTH ROUTES
const login = (data) => http.post("/auth/login", data); // done
const register = (data) => http.post("/auth/register", data);
const getCurrent = () => http.get("/auth/currentuser"); //done
const updateProfile = (data) => {
  // console.log(data);
  return http.patch("/auth/update", data); // done
};
// CHAT ROUTES
const getAllChats = (params) => http.get("/chat", { params }); // done
const getOrCreateOneToOneChat = (receiverId) => http.post(`/chat/single/${receiverId}`);
const deleteOneToOneChat = (chatId) => http.delete(`/chat/remove/${chatId}`);
const getAllAvaliableChats = () => http.get("/chat/all");
const getAvalialbeUsers = () => http.get("/chat/users"); // done

// group
const createGroupChat = (data) => http.post("/chat/group", data); // done
const getGroupChatDetails = (chatId) => http.get(`/chat/group/${chatId}`); // done

const updateGroupChat = (chatId, data) => http.patch(`/chat/group/${chatId}`, data); //done

const deleteGroupChat = (chatId) => http.delete(`/chat/group/${chatId}`);

const addNewParticipantsInGroupChat = (chatId, participantsList) => {
  // console.log("channelId:", chatId, { participantsList });
  return http.post(`/chat/group/${chatId}`, participantsList); // done
};

const removeParticipantFromGroupChat = (chatId, participantId) =>
  http.delete(`/chat/group/${chatId}/${participantId}`); // done

const joinGroupChat = (chatId) => {
  return http.post(`/chat/group/join/${chatId}`, chatId); // done
};
const leaveGroupChat = (chatId) => http.delete(`/chat/group/leave/${chatId}`); // done

// MESSAGE ROUTES
const getAllMessages = (chatId) => {
  // console.log(`GET/messages/ ${chatId}`);
  return http.get(`/message/${chatId}`);
}; // done
const createMessage = (chatId, data) => http.post(`/message/${chatId}`, data); // done

const deleteMessage = (chatId, messageId) => http.delete(`/message/${chatId}/${messageId}`);

export const api = {
  login,
  register,
  updateProfile,
  getCurrent,
  getAllChats,
  getAllAvaliableChats,
  getOrCreateOneToOneChat,
  deleteOneToOneChat,
  getAvalialbeUsers,
  createGroupChat,
  getGroupChatDetails,
  joinGroupChat,
  updateGroupChat,
  deleteGroupChat,
  addNewParticipantsInGroupChat,
  removeParticipantFromGroupChat,
  leaveGroupChat,
  getAllMessages,
  createMessage,
  deleteMessage,
};
