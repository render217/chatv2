const express = require('express');
const User = require('../model/user.model');
const Chat = require('../model/chat.model');
const ChatMessage = require('../model/message.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { default: mongoose } = require('mongoose');
const { emitSocketEvent } = require('../socket');
const { ChatEventEnum } = require('../utils/constants');
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getAllMessages = async (req, res) => {
  const { chatId } = req.params;
  const chatExist = await Chat.findById(chatId);
  if (!chatExist) {
    throw new ApiError(404, 'Chat does not exist');
  }
  const messages = await ChatMessage.aggregate([
    {
      $match: {
        chat: mongooseId(chatId),
      },
    },
    {
      $sort: {
        updatedAt: 1,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'sender',
        foreignField: '_id',
        as: 'sender',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $set: {
        sender: { $first: '$sender' },
      },
    },
  ]);

  const payload = messages ?? [];
  console.log(payload);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { messages: payload },
        'Successfully fetched messages'
      )
    );
};
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const sendMessage = async (req, res) => {
  const {
    params: { chatId },
    body: { content },
  } = req;
  if (!content) {
    throw new ApiError(400, 'Content is Required');
  }

  let existingChat = await Chat.findById(chatId);
  if (!existingChat) {
    throw new ApiError(400, "Chat doesn't exist");
  }
  const newMessage = await ChatMessage.create({
    chat: chatId,
    content: content,
    sender: req.user._id,
  });

  // update the lastMessage of the chat
  existingChat.lastMessage = newMessage._id;
  existingChat.save();
  //
  const messages = await ChatMessage.aggregate([
    {
      $match: {
        _id: newMessage._id,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'sender',
        foreignField: '_id',
        as: 'sender',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $set: {
        sender: { $first: '$sender' },
      },
    },
    { $unset: ['__v'] },
  ]);

  const receviedMessage = messages[0];

  existingChat.participants.forEach((participantId) => {
    if (participantId.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participantId.toString(),
      ChatEventEnum.MESSAGE_RECEIVED_EVENT,
      receviedMessage
    );
  });

  res
    .status(201)
    .json(new ApiResponse(201, receviedMessage, 'successfully sent message'));
};
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deleteMessage = async (req, res) => {
  const { chatId, messageId } = req.params;

  if (!mongooseId(chatId) && !mongooseId(messageId)) {
    throw new ApiError(400, 'Invalid id');
  }

  const existingChat = await Chat.findById(chatId);
  if (!existingChat) {
    throw new ApiError(400, "Chat doesn't exist");
  }

  const messageTobeDeleted = await ChatMessage.findByIdAndDelete(messageId);

  console.log('messageToBeDeleted: ', messageTobeDeleted);

  existingChat.participants.forEach((participantId) => {
    if (participantId.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participantId.toString(),
      ChatEventEnum.DELETE_MESSAGE_EVENT,
      messageTobeDeleted
    );
  });

  const payload = messageTobeDeleted;
  res
    .status(200)
    .json(new ApiResponse(200, payload, 'successfully deleted message'));
};
// module exports
module.exports = {
  getAllMessages,
  sendMessage,
  deleteMessage,
};

const mongooseId = (id) => {
  return new mongoose.Types.ObjectId(id);
};
