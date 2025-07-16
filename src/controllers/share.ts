import { RequestHandler } from "express";
import contentModel from "../db/content";

import CryptoJs from "crypto-js"
const secretKey = "Jagdish-Suthar";


export const SharedContent : RequestHandler = async (req, res)=> {
    const {id} = req.params;

    if(id) {
        try {
            const safeId = decodeURIComponent(id)
            const byteId = CryptoJs.AES.decrypt(safeId, secretKey);
            const originalId = byteId.toString(CryptoJs.enc.Utf8)
            console.log(originalId);
            const results = await contentModel.find({userId : originalId});
            if(results) {
                res.json({
                success : true,
                message : "Brain Information Fetched Successfully",
                data : results
            })
            }
            else {
                res.json({
                success : false,
                message : "Brain Information Not Found"
            })
            }
            
        }
        catch(err) {
            console.log(err);
            res.json({
                success : false,
                message : "Database Issue",
            })
        }
    }
    else {
        res.json({
                success : false,
                message : "UserId is not Defind"
            })
    }
}


type ContentTypeResponse = {
    success: boolean,
    message: string,
    data?: object

}

type SpecificContentType = {
    id: string,
    type: string,
}

export const ShareContentType: RequestHandler<SpecificContentType, ContentTypeResponse, {}> = async (req, res) => {
    const { id, type } = req.params;
    const safeId = decodeURIComponent(id)
    const byteId = CryptoJs.AES.decrypt(safeId, secretKey);
    const originalId = byteId.toString(CryptoJs.enc.Utf8)
    if (originalId) {
        try {
            const content = await contentModel.find({ userId : originalId, type }).populate("allTags");
            // console.log(content);
            if (content) {
                res.status(200).json({
                    success: true,
                    message: "Data fetched Successfully",
                    data: content
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Data Not Found",
                })
            }
        }
        catch (err) {
            console.log(err);
            res.status(404).json({
                success: false,
                message: "Database Issue",
            })
        }
    }

    else {
        res.status(400).json({
            success: false,
            message: "UserId is Not correct"
        })
    }
}