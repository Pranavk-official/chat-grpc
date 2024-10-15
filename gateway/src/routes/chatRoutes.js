const express = require("express");
const chatController = require("../controllers/chatController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/send", auth, chatController.sendMessage);
router.get("/messages/:userId", auth, chatController.getMessages);

module.exports = router;
