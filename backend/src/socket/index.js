const { Server, Socket } = require('socket.io');
const ApiError = require('../utils/ApiError');
const User = require('../model/user.model');
const { verifyToken } = require('../utils/authUtils');
const { ChatEventEnum, AvailableChatEvents } = require('../utils/constants');

/**
 *
 * @param {Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} io
 */
const inializeSocketIO = (io) => {
  return io.on('connection', async (socket) => {
    console.log('connection', socket.id);
    try {
      let token = socket.handshake.auth?.token;
      console.log({ socketToken: token });
      if (!token) {
        throw new ApiError(401, 'Un-authorized handshake....(token missing)');
      }
      const decoded = verifyToken(token);
      const { _id } = decoded;
      const user = await User.findById(_id).select('-password');

      if (!user) {
        throw new ApiError(401, 'Un-authorized...(Token Invalid)');
      }

      socket.user = user;

      socket.join(user._id.toString()); // just like socket.id
      socket.emit(ChatEventEnum.CONNECTED_EVENT, user._id.toString());
      console.log('User connected 🗼.', user._id.toString());

      // COMMON EVENTS that need to be mounted on initialization

      // 1. when user selects a chat (groupChat | one-to-oneChat)
      // so that events specific to that chatId can occur
      socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
        console.log(`User joined the chat. chatId:`, chatId);
        socket.join(chatId);
      });

      // 2. To emit typing event to other participants in ChatId
      // socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
      //   socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
      // });

      // 3. To emit stop-typing event to other participants in chatId
      // socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
      //   socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
      // });

      // 4. disconnect Event
      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log('user has disconnected. userId:', socket.user?._id);
      });
    } catch (error) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || 'Something went wrong while connecting to the socket'
      );
    }
  });
};
/**
 *
 * @param {import("express").Request} req - Request object to access the `io` instance set at the entry point
 * @param {string} roomId - Room where the event should be emitted
 * @param {AvailableChatEvents[0]} event - Event that should be emitted
 * @param {any} payload - Data that should be sent when emitting the event
 * @description Utility function responsible to abstract the logic of socket emission via the io instance
 */
const emitSocketEvent = (req, roomId, event, payload) => {
  /* 
        since we set io instance  in app.set('io',io);
        we can access it with req.app.get('io')
    */
  console.log({
    receiverId: roomId,
    event: event,
    payload: payload,
  });

  req.app.get('io').in(roomId).emit(event, payload);
};

const emitSocketToAllExceptMeEvent = (req, roomId, event, payload) => {
  req.app.get('io').except(roomId).emit(event, payload);
};
module.exports = {
  inializeSocketIO,
  emitSocketEvent,
  emitSocketToAllExceptMeEvent,
};
