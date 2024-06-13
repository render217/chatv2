const express = require('express');
const { checkAuth } = require('../middleware/checkAuth');
const router = express.Router();
const {
  getAllMessages,
  sendMessage,
  deleteMessage,
} = require('../controller/message.controller');
// jwt required for all message route
router.use(checkAuth);

router.route('/:chatId').get(getAllMessages).post(sendMessage);
router.route('/:chatId/:messageId').delete(deleteMessage);

module.exports = router;
