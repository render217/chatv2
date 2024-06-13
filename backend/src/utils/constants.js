/**
 * @description set of events avaliable for chat
 */
exports.ChatEventEnum = Object.freeze({
  // once user is ready to go
  CONNECTED_EVENT: 'connected',

  // when user gets disconnected
  DISCONNECT_EVENT: 'disconnect',

  // whe participant starts typing
  TYPING_EVENT: 'typing',

  // when participant stops typing
  STOP_TYPING_EVENT: 'stopTyping',

  /*========================================================================*/
  // when user joins a socket room(group or one to one chat)
  JOIN_CHAT_EVENT: 'joinChat',

  // when new one-yo-one chat ||  new group chat
  NEW_CHAT_EVENT: 'newChat',

  // when admin updates a group detail
  // add/remove participant || update group detail (name or desc)
  UPDATE_GROUP_EVENT: 'updateGroup',

  //when participant  leaves a group
  LEAVE_CHAT_EVENT: 'leaveChat',

  // when  group | one-to-one chat
  DELETE_CHAT_EVENT: 'deleteChat',

  // when new message is received
  MESSAGE_RECEIVED_EVENT: 'messageReceived',

  // when participant gets removed from group by admin |  leave by them self  ,
  // N.B : event send to the removed member only
  REMOVE_MEMBER_EVENT: 'removedmemberFromChat',

  // when there is an error in socket
  SOCKET_ERROR_EVENT: 'socketError',
});

exports.AvaliableChatEvents = Object.values(this.ChatEventEnum);
