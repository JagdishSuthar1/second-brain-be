import mongoose from "mongoose";
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    members : [{type : Schema.ObjectId , ref : "users"}],
    message : {type : String  , required : true},
},{
    timestamps : true
})

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;