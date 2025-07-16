import mongoose from "mongoose";
const Schema = mongoose.Schema;


const groupSchema = new Schema({
    groupId : {type : Schema.ObjectId , ref : "groupChats"},
    userId : {type : Schema.ObjectId , ref : "users"},
    message : {type : String , required : true}
},{
    timestamps : true
})

const groupMessageModel = mongoose.model("groupMessages" , groupSchema);

export default groupMessageModel;