import mongoose  from "mongoose";
const Schema = mongoose.Schema;


const tagSchema = new Schema({
    title : {type : String , required : true}
})



const tagsModel = mongoose.model("tags" , tagSchema);

export default tagsModel