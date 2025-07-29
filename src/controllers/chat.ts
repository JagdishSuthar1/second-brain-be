import { RequestHandler } from "express";
import { groupChatModel, one2oneChatModel } from "../db/chat";
import { MiddlewareOptions } from "mongoose";



export const GetAllChats: RequestHandler = async (req, res) => {
    const { userId } = req.params;
    ////console.log(userId);

    if (userId) {
        try {
            const results = await one2oneChatModel.find({ members: userId }).populate("members");
            // ////console.log("results fetching chats: ", results);
            
            const dummy = [...results];
            let newArray = []
            for (let i = 0; i < dummy.length; i++) {
                if (dummy[i].members[0]._id.toString() == userId) {
                    const newItem = {
                        _id: dummy[i]._id,
                        myId: userId,
                        friendId: dummy[i].members[1],
                        latestMessage: dummy[i].latestMessage
                    }

                    newArray.push(newItem);
                }
                else {
                    const newItem = {
                        _id: dummy[i]._id,
                        myId: userId,
                        friendId: dummy[i].members[0],
                        latestMessage: dummy[i].latestMessage
                    }

                    newArray.push(newItem);
                }
            }

            // ////console.log("new array", newArray)



            res.status(200).json({
                success: true,
                message: "All Chats are fetched Successfully",
                data: newArray
            })
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: "Database Issue"
            })
        }
    }
    else {
        res.json({
            success: false,
            message: "UserId is not Provided"
        })
    }
}


export const GetAllGroupChats: RequestHandler = async (req, res) => {
    const { userId } = req.params;

    if (userId) {
        try {
            const results = await groupChatModel.find({ members: userId }).populate({ path: "members" }).populate({ path: "groupAdmin" });

            res.status(200).json({
                success: true,
                message: "All  Group Chats are fetched Successfully",
                data: results
            })
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: "Database Issue"
            })
        }
    }
    else {
        res.json({
            success: false,
            message: "UserId is not Provided"
        })
    }
}


export const CreateGroupChat: RequestHandler = async (req, res) => {
    const { groupAdminId } = req.params;

    const reqBody = req.body;


    if (groupAdminId) {
        reqBody.members.push(groupAdminId);
        if (reqBody.members.length < 2) {
            res.json({
                success: false,
                message: "Group have atleast two users"
            })
        }
        else {
            try {
                await groupChatModel.create({
                    groupAdmin: groupAdminId,
                    members: reqBody.members,
                    name: reqBody.name
                });


                res.status(200).json({
                    success: true,
                    message: "Group Chat created Successfully",
                })
            }
            catch (err) {
                res.status(400).json({
                    success: false,
                    message: "Database Issue"
                })
            }
        }

    }
    else {
        res.json({
            success: false,
            message: "groupAdminId is not Provided"
        })
    }
}



export const CreateFriendChat: RequestHandler = async (req, res) => {
    const { userId } = req.params;
    const { friendId } = req.body;

    if (friendId) {
        try {
            const findChat = await one2oneChatModel.findOne({ "members": { $all: [userId, friendId] } }).populate("members");
            // ////console.log("findChat", findChat);


            if (findChat != null) {
                const dummy = [findChat];
                let newArray = []
                for (let i = 0; i < dummy.length; i++) {
                    if (dummy[i].members[0]._id.toString() == userId) {
                        const newItem = {
                            _id: dummy[i]._id,
                            myId: userId,
                            friendId: dummy[i].members[1],
                            latestMessage: dummy[i].latestMessage
                        }

                        newArray.push(newItem);
                    }
                    else {
                        const newItem = {
                            _id: dummy[i]._id,
                            myId: userId,
                            friendId: dummy[i].members[0],
                            latestMessage: dummy[i].latestMessage
                        }

                        newArray.push(newItem);
                    }
                }

                // ////console.log("new array after changing" , newArray)
                res.json({
                    success: false,
                    message: "Already chat is Present",
                    data: newArray
                })
            }
            else {
                let getFromDb = await one2oneChatModel.create({
                    members: [userId, friendId]
                });
                
                const result  = await one2oneChatModel.findById(getFromDb._id).populate("members");
                

                const dummy = [result!];
                let newArray = []
                for (let i = 0; i < dummy.length; i++) {
                    if (dummy[i].members[0].toString() == userId) {
                        const newItem = {
                            _id: dummy[i]._id,
                            myId: dummy[i].members[0]._id,
                            friendId: dummy[i].members[1],
                            latestMessage: dummy[i].latestMessage
                        }

                        newArray.push(newItem);
                    }
                    else {
                        const newItem = {
                            _id: dummy[i]._id,
                            myId: dummy[i].members[1]._id,
                            friendId: dummy[i].members[0],
                            latestMessage: dummy[i].latestMessage
                        }

                        newArray.push(newItem);
                    }
                }


                // ////console.log("result after creating", result)
                res.status(200).json({
                    success: true,
                    message: "friend Chat created Successfully",
                    data: newArray
                })
            }
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: "Database Issue"
            })
        }
    }
    else {
        res.json({
            success: false,
            message: "UserId and friend is not Provided"
        })
    }
}



export const RenameGroupChat: RequestHandler = async (req, res) => {
    const { GroupId } = req.params;

    if (GroupId) {
        try {
            const results = await groupChatModel.findByIdAndUpdate(
                GroupId
                , {
                    name: req.body.newName
                }, {
                new: true
            });


            res.status(200).json({
                success: true,
                message: "Group Chat renamed Successfully",
                data: results
            })
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: "Database Issue"
            })
        }
    }
    else {
        res.json({
            success: false,
            message: "GroupId is not Provided"
        })
    }
}



export const RemoveGroupChat: RequestHandler = async (req, res) => {
    const { userId, GroupId } = req.params;

    if (GroupId) {

        try {
            await groupChatModel.deleteOne({ GroupId });
            const results = await groupChatModel.find({ "members._id": userId })
            res.status(200).json({
                success: true,
                message: "Group Chat removed Successfully",
                data: results
            })
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: "Database Issue"
            })
        }
    }


    else {
        res.json({
            success: false,
            message: "GroupId is not Provided"
        })
    }
}


export const AddUserTOGroupChat: RequestHandler = async (req, res) => {
    const { userId, GroupId } = req.params;

    if (GroupId && userId) {

        try {
            const results = await groupChatModel.findByIdAndUpdate(
                GroupId,
                {
                    $addToSet: {
                        members: userId
                    }
                }, {
                new: true
            }
            ).populate({ path: "members" }).populate({ path: "latestMessage" });;

            res.status(200).json({
                success: true,
                message: "Group Chat removed Successfully",
                data: results
            })
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: "Database Issue"
            })
        }
    }


    else {
        res.json({
            success: false,
            message: "GroupId is not Provided"
        })
    }
}


export const RemoveUserFromGroupChat: RequestHandler = async (req, res) => {
    const { userId, GroupId } = req.params;

    if (GroupId && userId) {

        try {
            const results = await groupChatModel.findByIdAndUpdate(
                GroupId,
                {
                    $pull: {
                        members: userId
                    }
                }, {
                new: true
            }
            ).populate({ path: "members" }).populate({ path: "latestMessage" });;

            res.status(200).json({
                success: true,
                message: "Group Chat removed Successfully",
                data: results
            })
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: "Database Issue"
            })
        }
    }


    else {
        res.json({
            success: false,
            message: "GroupId is not Provided"
        })
    }
}


