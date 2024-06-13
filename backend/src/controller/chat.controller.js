const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/user.model');
const Chat = require('../model/chat.model');
const ChatMessage = require('../model/message.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { emitSocketEvent, emitSocketToAllExceptMeEvent } = require('../socket');
const { ChatEventEnum } = require('../utils/constants');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getAvaliableChats = async (req, res) => {
  // get all chats (groupChat)
  const chats = await Chat.aggregate([
    {
      $match: {
        isGroupChat: true,
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [{ $unset: ['password', '__v'] }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [{ $unset: ['password', '__v'] }],
      },
    },
    {
      $lookup: {
        from: 'chatmessages',
        localField: 'lastMessage',
        foreignField: '_id',
        as: 'lastMessage',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'sender',
              foreignField: '_id',
              as: 'sender',
              pipeline: [{ $unset: ['password', '__v'] }],
            },
          },
          {
            $set: {
              sender: { $first: '$sender' },
            },
          },
        ],
      },
    },
    {
      $set: {
        admin: { $first: '$admin' },
        lastMessage: { $first: '$lastMessage' },
      },
    },
    {
      $unset: ['lastMessage.__v', 'lastMessage.chat', '__v'],
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, chats || [], 'User chats fetched successfully!')
    );
};
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const getAllChats = async (req, res) => {
  const userId = req.user._id;
  // const { type } = req.query;

  // let isType = type === 'all' ? true : type === 'group' ? true : false;
  // get all chats (groupChat)
  const chats = await Chat.aggregate([
    {
      $match: {
        participants: { $elemMatch: { $eq: userId } },
        // isGroupChat: isType,
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [{ $unset: ['password', '__v'] }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [{ $unset: ['password', '__v'] }],
      },
    },
    {
      $lookup: {
        from: 'chatmessages',
        localField: 'lastMessage',
        foreignField: '_id',
        as: 'lastMessage',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'sender',
              foreignField: '_id',
              as: 'sender',
              pipeline: [{ $unset: ['password', '__v'] }],
            },
          },
          {
            $set: {
              sender: { $first: '$sender' },
            },
          },
        ],
      },
    },
    {
      $set: {
        admin: { $first: '$admin' },
        lastMessage: { $first: '$lastMessage' },
      },
    },
    {
      $unset: ['lastMessage.__v', 'lastMessage.chat', '__v'],
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, chats || [], 'User chats fetched successfully!')
    );
};
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getChatFeed = async (req, res) => {
  const userId = req.user._id;
  // const { type } = req.query;

  const chats = await Chat.aggregate([
    {
      $match: {
        $or: [
          { participants: { $elemMatch: { $eq: userId } } },
          { isGroupChat: true },
        ],
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [{ $unset: ['password', '__v'] }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [{ $unset: ['password', '__v'] }],
      },
    },
    {
      $lookup: {
        from: 'chatmessages',
        localField: 'lastMessage',
        foreignField: '_id',
        as: 'lastMessage',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'sender',
              foreignField: '_id',
              as: 'sender',
              pipeline: [{ $unset: ['password', '__v'] }],
            },
          },
          {
            $set: {
              sender: { $first: '$sender' },
            },
          },
        ],
      },
    },
    {
      $set: {
        admin: { $first: '$admin' },
        lastMessage: { $first: '$lastMessage' },
      },
    },
    {
      $unset: ['lastMessage.__v', 'lastMessage.chat', '__v'],
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, chats || [], 'User chats fetched successfully!')
    );
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const searchAvaliableUsers = async (req, res) => {
  const userId = req.user._id;
  const users = await User.aggregate([
    {
      $match: {
        _id: { $ne: userId },
      },
    },
    {
      $set: {
        password: '$$REMOVE',
        __v: '$$REMOVE',
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, { users }, 'Users fetched successfully'));
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const createOrGetOneToOneChat = async (req, res) => {
  const { receiverId } = req.params;

  // check if user exist
  const receiver = await User.findById(receiverId);

  if (!receiver) {
    throw new ApiError(404, 'Receiver does not exist');
  }

  if (receiver._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot chat with your self');
  }

  const existingChat = await Chat.aggregate([
    {
      $match: {
        isGroupChat: false,
        $and: [
          {
            participants: { $elemMatch: { $eq: mongooseId(receiverId) } },
          },
          {
            participants: { $elemMatch: { $eq: req.user._id } },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [
          {
            $set: {
              password: '$$REMOVE',
              __v: '$$REMOVE',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [
          {
            $unset: ['password', '__v'],
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'chatmessages',
        localField: 'lastMessage',
        foreignField: '_id',
        as: 'lastMessage',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'sender',
              foreignField: '_id',
              as: 'sender',
              pipeline: [{ $unset: ['password', '__v'] }],
            },
          },
          { $set: { sender: { $first: '$sender' } } },
        ],
      },
    },
    {
      $set: {
        admin: { $first: '$admin' },
        lastMessage: { $first: '$lastMessage' },
      },
    },
    { $unset: ['lastMessage.__v', 'lastMessage.chat', '__v'] },
  ]);

  if (existingChat.length) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { chat: existingChat[0], alreadyExists: true },
          'Chat fetched Successfully'
        )
      );
  }

  const newChat = await Chat.create({
    chatName: 'One to One Chat',
    chatDescription: 'One to One Chat',
    isGroupChat: false,
    admin: req.user._id,
    participants: [req.user._id, mongooseId(receiverId)],
  });

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: { $eq: newChat._id },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [
          {
            $unset: ['password', '__v'],
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [
          {
            $set: {
              password: '$$REMOVE',
              __v: '$$REMOVE',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'chatmessages',
        localField: 'lastMessage',
        foreignField: '_id',
        as: 'lastMessage',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'sender',
              foreignField: '_id',
              as: 'sender',
              pipeline: [{ $unset: ['password', '__v'] }],
            },
          },
          {
            $set: {
              sender: { $first: '$sender' },
            },
          },
        ],
      },
    },
    {
      $set: {
        admin: { $first: '$admin' },
        lastMessage: { $first: '$lastMessage' },
      },
    },
    {
      $unset: ['lastMessage.__v', 'lastMessage.chat', '__v'],
    },
  ]);

  const payload = chat[0];
  console.log({ payload });
  // send event to the receiver only
  payload.participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;
    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.NEW_CHAT_EVENT,
      payload
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { chat: payload, alreadyExists: false },
        'Chat fetched successfully'
      )
    );
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const createAGroupChat = async (req, res) => {
  const { name, description, participants } = req.body;
  if (!name || !description) {
    throw new ApiError(400, 'All fields are required');
  }
  const existingGroupChat = await Chat.aggregate([
    {
      $match: {
        isGroupChat: true,
        chatName: name,
      },
    },
  ]);

  if (existingGroupChat.length) {
    throw new ApiError(400, 'Group Chat is Avaliable. Use other name');
  }
  // let members = participants?.length
  //   ? [req.user._id.toString(), ...participants]
  //   : [req.user._id.toString()];
  let members = participants?.length
    ? [req.user._id, ...participants]
    : [req.user._id];

  members = [...new Set([...members])]; // check for duplicates
  const newGroupChat = await Chat.create({
    isGroupChat: true,
    chatName: name,
    chatDescription: description,
    admin: req.user._id,
    participants: members,
  });

  const groupChats = await Chat.aggregate([
    {
      $match: {
        _id: { $eq: newGroupChat._id },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [
          {
            $set: {
              password: '$$REMOVE',
              __v: '$$REMOVE',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [
          {
            $set: {
              password: '$$REMOVE',
              __v: '$$REMOVE',
            },
          },
        ],
      },
    },
    {
      $addFields: {
        admin: { $first: '$admin' },
      },
    },
  ]);

  const payload = groupChats[0];

  // newGroupChat.participants.forEach((participantId) => {
  //   console.log(participantId);
  //   if (participantId.toString() === req.user._id.toString()) return;
  //   emitSocketEvent(
  //     req,
  //     participantId.toString(),
  //     ChatEventEnum.NEW_CHAT_EVENT,
  //     payload
  //   );
  // });

  emitSocketToAllExceptMeEvent(
    req,
    req.user._id.toString(),
    ChatEventEnum.NEW_CHAT_EVENT,
    payload
  );
  return res
    .status(200)
    .json(new ApiResponse(200, payload, 'Chat Created successfully'));
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const getGroupChatDetails = async (req, res) => {
  const { chatId } = req.params;
  const existingGroupChat = await Chat.aggregate([
    {
      $match: {
        _id: { $eq: mongooseId(chatId) },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [
          {
            $set: {
              password: '$$REMOVE',
              __v: '$$REMOVE',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [
          {
            $set: {
              password: '$$REMOVE',
              __v: '$$REMOVE',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'chatMessages',
        localField: 'lastMessage',
        foreignField: 'chat',
        as: 'lastMessage',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'sender',
              foreignField: '_id',
              as: 'sender',
              pipeline: [
                {
                  $set: {
                    password: '$$REMOVE',
                    __v: '$$REMOVE',
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              sender: { $first: '$sender' },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        admin: { $first: '$admin' },
        lastMessage: { $first: '$lastMessage' },
      },
    },
  ]);
  if (!existingGroupChat.length) {
    throw new ApiError(404, "Group Chat Doesn't Exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        existingGroupChat[0],
        'GroupChat Fetched Successfully'
      )
    );
};
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const addNewParticipantsInGroupChat = async (req, res) => {
  const {
    params: { chatId },
    body: { participants },
  } = req;

  const existingChat = await Chat.findOne({
    _id: chatId,
    isGroupChat: true,
  });

  if (!existingChat) {
    throw new ApiError(404, "Group chat doesn't exist");
  }

  const isAdmin = existingChat.admin._id.toString() === req.user._id.toString();
  if (!isAdmin) {
    throw new ApiError(400, 'You are not an admin');
  }

  const members = participants?.length
    ? [...existingChat.participants, ...participants]
    : [...existingChat.participants];
  // const existingUser = await User.findById(participantId);
  // if (!existingUser) {
  //   throw new ApiError(404, "User doesn't exist");
  // }
  // const existingParticipants = existingChat.participants;

  // if (existingParticipants.includes(participantId)) {
  //   throw new ApiError(400, 'Participant already exists');
  // }

  existingChat.participants = members;
  await existingChat.save();
  const groupChat = await Chat.aggregate([
    {
      $match: {
        _id: existingChat._id,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [
          {
            $set: {
              password: '$$REMOVE',
              __v: '$$REMOVE',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [{ $unset: ['password', '__v'] }],
      },
    },
    {
      $lookup: {
        from: 'chatMessages',
        localField: 'lastMessage',
        foreignField: 'chat',
        as: 'lastMessage',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'sender',
              foreignField: '_id',
              as: 'sender',
              pipeline: [{ $unset: ['password', '__v'] }],
            },
          },
          {
            $addFields: {
              sender: { $first: '$sender' },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        admin: { $first: '$admin' },
        lastMessage: { $first: '$lastMessage' },
      },
    },
  ]);
  const payload = groupChat[0];
  existingChat.participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;
    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.UPDATE_GROUP_EVENT,
      payload
    );
  });

  return res
    .status(201)
    .json(new ApiResponse(201, payload, 'Participants added successfully'));
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const removeParticipantFromGroupChat = async (req, res) => {
  const { chatId, participantId } = req.params;
  const existingChat = await Chat.findOne({
    _id: mongooseId(chatId),
    isGroupChat: true,
  });

  // check if the chat exists
  if (!existingChat) {
    throw new ApiError(404, "Chat doesn't exist");
  }

  // check if the logged in user is the admin
  if (existingChat.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(400, 'You are not an admin');
  }

  // check if the user exist(it might delete it's account)
  const exsitingUser = await User.findById(participantId);
  if (!exsitingUser) {
    throw new ApiError("User doesn't exist");
  }
  // check if the user is in the group
  const participantFound = existingChat.participants.includes(participantId);
  if (!participantFound) {
    throw new ApiError(404, 'User is not in the group');
  }

  // update the group (remove the participant from the group)
  const updatedGroupChat = await Chat.findByIdAndUpdate(
    existingChat._id,
    {
      $pull: {
        participants: exsitingUser._id,
      },
    },
    {
      new: true,
    }
  );
  const chat = await Chat.aggregate([
    {
      $match: {
        _id: existingChat._id,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $addFields: {
        admin: { $first: '$admin' },
      },
    },
  ]);

  const payload = chat[0];

  // send
  payload.participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;
    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.UPDATE_GROUP_EVENT,
      payload
    );
  });

  // // event sent to the participant that is currently being removed
  emitSocketEvent(
    req,
    exsitingUser?._id.toString(),
    ChatEventEnum.REMOVE_MEMBER_EVENT,
    payload
  );

  res
    .status(200)
    .json(new ApiResponse(200, payload, 'Successfully removed participant'));
};
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const updateGroupChatDetail = async (req, res) => {
  const {
    params: { chatId },
    body: { name, description },
  } = req;
  console.log('updateGroupchatPayload: ', req.params, req.body);
  if (!name || !description) {
    throw new ApiError(400, 'All Fields are required');
  }
  const existingChat = await Chat.findOne({
    _id: mongooseId(chatId),
    isGroupChat: true,
  });
  if (!existingChat) {
    throw new ApiError(404, "Chat doesn't exist");
  }

  if (existingChat.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(400, 'You are not an admin');
  }
  existingChat.chatName = name;
  existingChat.chatDescription = description;
  await existingChat.save();

  const updatedChat = await Chat.aggregate([
    {
      $match: {
        _id: existingChat._id,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $addFields: {
        admin: { $first: '$admin' },
      },
    },
  ]);

  if (updatedChat.length === 0) {
    throw new ApiError(500, 'Internal Server Error');
  }
  const payload = updatedChat[0];

  updatedChat[0].participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.UPDATE_GROUP_EVENT,
      payload
    );
  });
  res
    .status(200)
    .json(new ApiResponse(200, payload, 'Successfully updated GroupChat'));
};
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const joinGroupChat = async (req, res) => {
  // console.log(req.params, req.user._id);
  const { chatId } = req.params;
  const userId = req.user._id;

  const existingChat = await Chat.findById(chatId);
  // const existingChat = false;
  if (!existingChat) {
    throw new ApiError(404, "Chat doesn't exist");
  }

  let members = existingChat.participants;
  let user = members.find((u) => u.toString() === userId.toString());
  // let user = true;

  if (user) {
    throw new ApiError(400, 'U are already in the group');
  }
  existingChat.participants = [userId, ...members];
  await existingChat.save();

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: existingChat._id,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $addFields: {
        admin: { $first: '$admin' },
      },
    },
  ]);

  const payload = chat[0];
  payload.participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;
    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.UPDATE_GROUP_EVENT,
      payload
    );
  });
  return res
    .status(201)
    .json(new ApiResponse(201, payload, 'Successfully Joined the group'));
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const leaveGroupChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  const existingChat = await Chat.findById(chatId);
  // const existingChat = false;
  if (!existingChat) {
    throw new ApiError(404, "Chat doesn't exist");
  }

  let members = existingChat.participants;
  members = members.filter((u) => u.toString() !== userId.toString());

  existingChat.participants = [...members];
  await existingChat.save();

  const updatedChat = await Chat.aggregate([
    {
      $match: {
        _id: existingChat._id,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin',
        pipeline: [{ $unset: ['__v', 'password'] }],
      },
    },
    {
      $addFields: {
        admin: { $first: '$admin' },
      },
    },
  ]);
  const payload = updatedChat[0];
  existingChat.participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;
    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.UPDATE_GROUP_EVENT,
      payload
    );
  });

  return res
    .status(201)
    .json(new ApiResponse(201, payload, 'Successfully Left the group'));
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const deleteOneToOneChat = async (req, res) => {
  const { chatId } = req.params;
  const existingChat = await Chat.findById(chatId);
  if (!existingChat) {
    throw new ApiError(404, "Chat doesn't exist");
  }

  const isAdmin = existingChat.admin.toString() === req.user._id.toString();
  if (!isAdmin) {
    throw new ApiError(400, "You can't delete the chat");
  }
  await Chat.findByIdAndDelete(chatId);
  await ChatMessage.deleteMany({
    chat: chatId,
  });

  const payload = existingChat;
  existingChat.participants.forEach((participantId) => {
    if (participantId.toString() === req.user._id.toString()) return;
    emitSocketEvent(
      req,
      participantId.toString(),
      ChatEventEnum.DELETE_CHAT_EVENT,
      payload
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payload, 'Successfully deleted Chat'));
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const deleteGroupChat = async (req, res) => {
  const { chatId } = req.params;
  const existingChat = await Chat.findById(chatId);

  if (!existingChat) {
    throw new ApiError(404, "Chat doesn't exist");
  }
  const isAdmin = existingChat.admin.toString() === req.user._id.toString();
  if (!isAdmin) {
    throw new ApiError(400, 'You are not an admin');
  }
  await Chat.findByIdAndDelete(chatId);
  await ChatMessage.deleteMany({
    chat: chatId,
  });
  const payload = existingChat;
  existingChat.participants.forEach((participantId) => {
    if (participantId.toString() === req.user._id.toString()) return;
    emitSocketEvent(
      req,
      participantId.toString(),
      ChatEventEnum.DELETE_CHAT_EVENT,
      payload
    );
  });
  return res
    .status(200)
    .json(new ApiResponse(200, payload, 'Successfully deleted Chat'));
};

module.exports = {
  getChatFeed,
  getAllChats,
  getAvaliableChats,
  searchAvaliableUsers,
  createOrGetOneToOneChat,
  createAGroupChat,
  getGroupChatDetails,
  addNewParticipantsInGroupChat,
  removeParticipantFromGroupChat,
  updateGroupChatDetail,
  updateGroupChatDetail,
  joinGroupChat,
  leaveGroupChat,
  deleteOneToOneChat,
  deleteGroupChat,
};

const mongooseId = (id) => {
  return new mongoose.Types.ObjectId(id);
};
