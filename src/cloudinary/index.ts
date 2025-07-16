import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import env from "dotenv";
env.config();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API,
    api_secret :process.env.CLOUDINARY_API_SECRET 
})

async function ImageAndVideoUploader(file_path : string) {
    console.log("in uploader")
    return new Promise(function(resolve ,reject) {
    const stream = cloudinary.uploader.upload_stream({
        resource_type : "auto"
    }, 
function(err, result) {
    if(err) {
        reject(err);
    }
    else {
        resolve(result)
    }
})

fs.createReadStream(file_path).on("error" , (err)=>{
    console.log("File stream creating is not done");
    reject(err);
}).pipe(stream)

})
 
}

async function DeleteVideoAndImage(public_id : string) {
    await cloudinary.uploader.destroy(public_id)
}
export {ImageAndVideoUploader, DeleteVideoAndImage}