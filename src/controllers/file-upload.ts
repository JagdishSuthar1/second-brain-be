import { RequestHandler } from "express";
import { ImageAndVideoUploader } from "../cloudinary";


export const FileUploadToCloudinary : RequestHandler = async (req, res)=> {
    if(!req.file) {
        //console.log("file is missing")
        res.json({
            success : false,
            message : "File is missing"
        })
    }
    else {
        //console.log("in the upload router")
        try {
            const data = await ImageAndVideoUploader(req.file.path);
            res.json({
                success : true,
                message : "File upload Successfully",
                data : data
            }) 

        }
        catch(err) {
            //console.log(err);
            res.json({
                success : false,
                message : "Error in file uploading",
            })
        }
    }
}

