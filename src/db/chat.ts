import mongoose from "mongoose";
const Schema = mongoose.Schema;


const groupChatSchema = new Schema({
    groupAdmin: { type: Schema.ObjectId, required: true , ref : "users"},
    members: [{ type: Schema.ObjectId, ref: "users" }],
    name: { type: String, required: true },
    latestMessage: { type: String, ref: "message" }
}, {
    timestamps: true
})



const groupChatModel = mongoose.model("groupChats", groupChatSchema);

const one2oneChatSchema = new Schema({
    members : [{ type: Schema.ObjectId, ref: "users" }],
    latestMessage: { type: String, ref: "message" }
}, {
    timestamps: true
})

const one2oneChatModel = mongoose.model("one2oneChats", one2oneChatSchema);

export { groupChatModel, one2oneChatModel }