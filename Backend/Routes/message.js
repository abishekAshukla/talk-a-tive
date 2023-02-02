const express = require('express')
const { protect } = require('../middlewareforchatapp/authmiddleware')
const {
    allMessages, delAllMessages,
    sendMessage,
    getblog,
  } = require("../controllersforchatapp/messagecontroller");

const router = express.Router()

router.route('/:chatId').get(protect , allMessages)
router.route('/del/:chatId').get(protect , delAllMessages)
router.route("/").post(protect, sendMessage);
router.route('/blog/:blogId').get(getblog)

module.exports = router;