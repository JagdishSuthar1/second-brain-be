import { RequestHandler } from "express";
import messageModel from "../db/message";
import { groupChatModel } from "../db/chat";
import groupMessageModel from "../db/groupMessages";

export const SendMessage: RequestHandler = async (req, res) => {
    const { userId } = req.params;

    const { friendId, message } = req.body;

    if (userId && friendId) {
        try {
            // console.log("type of : ", typeof message)
            const getFromDb = await messageModel.create({
                members: [userId, friendId],
                message: message
            })

            const results = await messageModel.findById(getFromDb._id).populate("members");
            //  const dummy = [results!];
            if (results) {
                let newArray = {}

                if (results.members[0].toString() == userId) {
                    newArray = {
                        _id: results._id,
                        myId: userId,
                        message: results.message,
                        friendId: results.members[1],
                    }

                }
                else {
                    newArray = {
                        _id: results._id,
                        myId: userId,
                        message: results.message,
                        friendId: results.members[0]
                    }

                }

                res.json({
            success: true,
            message: "Message Add Successfully",
            data: newArray
            })

        }

        else {
            res.json({
            success: false,
            message: "Message Not Added",
        })
        }


            
        
    }
        catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Database Issue"
        })
    }
}
    else {
    res.json({
        success: false,
        message: "UserId RecieverId and Message are not provided"
    })
}
}




export const GetAllMessage: RequestHandler = async (req, res) => {
    const { userId, friendId } = req.params;

    // console.log("message router")
    if (userId && friendId) {
        // console.log("user : ", userId  + " and friendId ", friendId )
        try {
            const results = await messageModel.find({ "members": { $all: [userId, friendId] } }).populate("members");
            // console.log("results from message : ", results)
            if (results.length >= 0) {
                const dummy = results;
                let newArray = [];


                for (let i = 0; i < dummy.length; i++) {
                    if (dummy[i].members[0]._id.toString() == userId) {
                        const newItem = {
                            _id: dummy[i]._id,
                            myId: userId,
                            message: dummy[i].message,
                            friendId: dummy[i].members[0]
                        }

                        newArray.push(newItem);
                    }
                    else {
                        const newItem = {
                            _id: dummy[i]._id,
                            myId: friendId,
                            message: dummy[i].message,
                            friendId: dummy[i].members[0]
                        }

                        newArray.push(newItem);
                    }
                    // console.log("new array of messages", newArray)


                }

                res.json({
                    success: true,
                    message: "Messages Fetch Successfully",
                    data: newArray
                })

            }
            else {
                res.json({
                    success: false,
                    message: "No Messages in the Database",
                })
            }
        }
        catch (err) {
            console.log(err);
            res.json({
                success: false,
                message: "Database Issue"
            })
        }
    }
    else {
        res.json({
            success: false,
            message: "UserId & FriendId are not provided"
        })
    }
}


export const SendGroupMessage: RequestHandler = async (req, res) => {

    const { groupId, userId, message } = req.body;

    if (groupId && userId && message) {
        try {
            // console.log("In send Group Message ");
            const getFromDb = await groupMessageModel.create({
                groupId: groupId,
                userId: userId,
                message: message
            })

            const result = await groupMessageModel.findById(getFromDb._id).populate("userId");

            res.json({
                success: true,
                message: "Group Message Add Successfully",
                data: result
            })
        }
        catch (err) {
            console.log(err);
            res.json({
                success: false,
                message: "Database Issue"
            })
        }
    }
    else {
        res.json({
            success: false,
            message: "UserId RecieverId and Message are not provided"
        })
    }
}




export const GetAllGroupMessage: RequestHandler = async (req, res) => {

    const { groupId } = req.params;

    if (groupId) {
        try {
            // console.log("In send Group Message ");
            const results = await groupMessageModel.find({
                groupId: groupId
            }).populate("userId").sort({ createdAt: 1 })


            res.json({
                success: true,
                message: "Group Messages fetch Successfully",
                data: results
            })
        }
        catch (err) {
            console.log(err);
            res.json({
                success: false,
                message: "Database Issue"
            })
        }
    }
    else {
        res.json({
            success: false,
            message: "GroupId are not provided"
        })
    }
}
