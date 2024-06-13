const express = require('express');
const { checkAuth } = require('../middleware/checkAuth');
const router = express.Router();
const {
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
  joinGroupChat,
  leaveGroupChat,
  deleteOneToOneChat,
  deleteGroupChat,
} = require('../controller/chat.controller');

// TODO: validation remaning

// jwt is required for all routes
router.use(checkAuth);

// router.route('/').get(getAllChats);
router.route('/').get(getChatFeed);
router.route('/all').get(getAvaliableChats);
router.route('/users').get(searchAvaliableUsers);

// group - route
router.route('/group').post(createAGroupChat);
router.route('/group/join/:chatId').post(joinGroupChat);
router.route('/group/leave/:chatId').delete(leaveGroupChat);

router
  .route('/group/:chatId')
  .get(getGroupChatDetails)
  .post(addNewParticipantsInGroupChat)
  .patch(updateGroupChatDetail)
  .delete(deleteGroupChat);

router.route('/single/:receiverId').post(createOrGetOneToOneChat);

router
  .route('/group/:chatId/:participantId')
  .delete(removeParticipantFromGroupChat);

router.route('/remove/:chatId').delete(deleteOneToOneChat);

module.exports = router;
