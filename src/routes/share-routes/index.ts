import express from "express"
import { ShareContentType, SharedContent } from "../../controllers/share";
const ShareBrainRouter = express.Router();


ShareBrainRouter.get("/:id" , SharedContent)
ShareBrainRouter.get("/:id/:type" , ShareContentType)
export default ShareBrainRouter