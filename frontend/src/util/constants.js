const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";

const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";

// group or one-to-one chat
const JOIN_CHANNEL_EVENT = "joinChat";

// on chat creation => (group or one-to-one)
const NEW_CHANNEL_EVENT = "newChat";

// on update chat => (group)
// add/remove participant || update group detail (name or desc)
const UPDATE_GROUP_EVENT = "updateGroup";

// when participant leaves a group
const LEAVE_CHANNEL_EVENT = "leaveChat";

// on new message receivied
const MESSAGE_RECEIVED_EVENT = "messageReceived";

// delete group | one-to-one chat
const DELETE_CHAT_EVENT = "deleteChat";

// when participants gets removed from group by admin |
// leave by them self
// N.B : event send to the removed member only
const REMOVE_MEMBER_EVENT = "removedmemberFromChat";

const SOCKET_ERROR_EVENT = "socketError";
export const chatEnum = {
  CONNECTED_EVENT,
  DISCONNECT_EVENT,
  JOIN_CHANNEL_EVENT,
  NEW_CHANNEL_EVENT,
  TYPING_EVENT,
  STOP_TYPING_EVENT,
  MESSAGE_RECEIVED_EVENT,
  LEAVE_CHANNEL_EVENT,
  DELETE_CHAT_EVENT,
  REMOVE_MEMBER_EVENT,
  UPDATE_GROUP_EVENT,
  SOCKET_ERROR_EVENT,
};
