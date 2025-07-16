import express from "express"
import { GetAllGroupMessage, GetAllMessage, SendGroupMessage, SendMessage } from "../../controllers/message";

const MessageRouter = express.Router();

MessageRouter.post("/send/:userId", SendMessage);
MessageRouter.get("/get-all/:userId/:friendId", GetAllMessage);
MessageRouter.post("/send-group", SendGroupMessage);
MessageRouter.get("/get-all-group/:groupId", GetAllGroupMessage);



export default MessageRouter