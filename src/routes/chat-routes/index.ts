import express from "express";
import { AddUserTOGroupChat, CreateFriendChat, CreateGroupChat, GetAllChats, GetAllGroupChats, RemoveGroupChat, RemoveUserFromGroupChat, RenameGroupChat } from "../../controllers/chat";

const ChatRouter = express.Router();

ChatRouter.get("/my-chats/:userId", GetAllChats);
ChatRouter.get("/my-group-chats/:userId", GetAllGroupChats);
ChatRouter.post("/create-group-chat/:groupAdminId", CreateGroupChat);
ChatRouter.post("/create-friend-chat/:userId", CreateFriendChat);
ChatRouter.post("/remove-group-chat/:groupId", RemoveGroupChat);
ChatRouter.put("/rename-group-chat/:groupId", RenameGroupChat);
ChatRouter.post("/add-user/:userId/:groupId", AddUserTOGroupChat);
ChatRouter.delete("/remove-user/:userId/:groupId", RemoveUserFromGroupChat);

export default ChatRouter