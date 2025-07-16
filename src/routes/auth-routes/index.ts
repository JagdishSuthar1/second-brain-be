import express , {Request , Response} from "express";
import { SignIn, SignUp } from "../../controllers/auth";

const AuthRouter = express.Router()

// type SignupProps = {
//     username : string,
//     password : string , 
//     email : string
// }


AuthRouter.post("/signup" ,SignUp)
AuthRouter.post("/signin" ,SignIn)


export default AuthRouter;
