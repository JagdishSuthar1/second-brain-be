import mongoose from "mongoose";
const Schema = mongoose.Schema;


const contentSchema = new Schema({
    link : {type : String },
    type : {type : String , enum : ["video" , "image" , "document" , "tweet" , "link" , "tag"] , required : true},
    title : {type : String , required : true},
    data : {type : String},
    allTags : [{type : Schema.ObjectId , ref : "tags"}],
    video_image_url : {type : String},
    public_id : {type : String},
    userId : {type : Schema.ObjectId , ref : "users"},
    created : {type : Date},
    embedding : [{type : Number}]
})

const contentModel = mongoose.model("content" , contentSchema);

export default contentModel 