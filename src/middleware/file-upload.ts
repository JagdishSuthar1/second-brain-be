import multer from "multer"
import path from "path"

// console.log(__dirname)
const storage = multer.diskStorage({
    destination : function(req, file , cb) {
        cb(null, path.join("C:/Users/Jagdi/Desktop/harkirat/second-brain/server/src", "uploads"));

    },
    filename : function(req, file , cb) {
        cb(null , file.originalname);
    }
})


const multerMilddlware = multer({
    storage : storage
})


export default multerMilddlware