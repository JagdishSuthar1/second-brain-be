import express , {Request , Response} from "express";
import {UserContent, ContentType , AddTag, AddContent, DeleteContent, GetContentById} from "../../controllers/dashboard";

const ContentRouter = express.Router()

// type SignupProps = {
//     username : string,
//     password : string , 
//     email : string
// }


ContentRouter.get("/:userId" ,UserContent)
ContentRouter.get("/single/:contentId" ,GetContentById)
ContentRouter.get("/:userId/:type" ,ContentType);
ContentRouter.post("/add-tag/:userId/" , AddTag);
ContentRouter.post("/add-content/:userId", AddContent);
ContentRouter.delete("/delete-content/:userId/:contentId", DeleteContent)

export default ContentRouter;
