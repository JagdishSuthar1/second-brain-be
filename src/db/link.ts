import mongoose from "mongoose";
const Schema = mongoose.Schema;


const linkSchema = new Schema({
    userId : {type : Schema.ObjectId , ref : "users" , required : true},
    hashedLink : {type : String , required : true}
})



const linkModel = mongoose.model("links" , linkSchema);

export default linkModel;