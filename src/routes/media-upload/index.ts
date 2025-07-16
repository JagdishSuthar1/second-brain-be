import express from "express";
import { FileUploadToCloudinary } from "../../controllers/file-upload";
import multerMilddlware from "../../middleware/file-upload";
const FileUploadRouter = express.Router();


FileUploadRouter.post("/upload" ,multerMilddlware.single("file"), FileUploadToCloudinary);

export default FileUploadRouter
