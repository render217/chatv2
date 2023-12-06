/**
 * @description set of events avaliable for chat
 */
exports.ChatEventEnum = Object.freeze({
  // once user is ready to go
  CONNECTED_EVENT: 'connected',

  // when user gets disconnected
  DISCONNECT_EVENT: 'disconnect',

  // when user joins a socket room
  JOIN_CHAT_EVENT: 'joinChat',

  //when participant gets removed from group, or leaves a group
  LEAVE_CHAT_EVENT: 'leaveChat',
  // when chat gets deleted
  DELETE_CHAT_EVENT: 'deleteChat',
  // when participant gets removed from group by admin |  leave by them self  ,
  // N.B : event send to the removed member only
  REMOVE_MEMBER_EVENT: 'removedmemberFromChat',

  // whe participant starts typing
  TYPING_EVENT: 'typing',

  // when participant stops typing
  STOP_TYPING_EVENT: 'stopTyping',

  // when new message is received
  MESSAGE_RECEIVED_EVENT: 'messageReceived',

  // ? when there is new one on one chat, new group chat or user gets added in the group
  NEW_CHAT_EVENT: 'newChat',

  // when admin updates a group name
  UPDATE_GROUP_NAME_EVENT: 'updateGroupName',

  // when there is an error in socket
  SOCKET_ERROR_EVENT: 'socketError',
});

exports.AvaliableChatEvents = Object.values(this.ChatEventEnum);
