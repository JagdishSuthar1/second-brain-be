import express, { NextFunction , Request, Response, ErrorRequestHandler} from "express";
const app = express();
import cors from "cors";
import mongoose  from "mongoose";
import AuthRouter from "./routes/auth-routes/"
import ContentRouter from "./routes/dashboard-routes/index";
import SearchRouter from "./routes/search-routes/index";
import ChatRouter from "./routes/chat-routes";
import MessageRouter from "./routes/message-routes";
import { Server } from "socket.io";
import FileUploadRouter from "./routes/media-upload";
import ShareBrainRouter from "./routes/share-routes";
// we have to create the app where we query the content and
// the query + relevant docs are send to the gpt and then gpt 
// give the explaination
import env from "dotenv";
env.config();

mongoose.connect(process.env.MONGODB_URL!).then(() => console.log("Database is Connected")).catch((err) => console.log("Database is not Connected"));
env.config();
app.use(cors(
    {
        origin: "https://second-brain-flax.vercel.app",
        methods: ['GET', 'POST', 'DELETE', 'PUT']
    }

));

app.use(express.json());

app.use("/api/v1/auth",AuthRouter);
app.use("/api/v1/content",ContentRouter);
app.use("/api/v1/search" , SearchRouter)
app.use("/api/v1/chats" , ChatRouter);
app.use("/api/v1/message" , MessageRouter);
app.use("/api/v1/media" , FileUploadRouter);
app.use("/api/v1/share" , ShareBrainRouter);;
// app.use("/api/v1/share",ShareRouter);


const errorHandler : ErrorRequestHandler  = (err : Error , req : Request , res : Response , next : NextFunction)=> {
    
     res.status(500).json({
        success : false,
        message : err.message
    })
}

app.use(errorHandler)


const server = app.listen(process.env.PORT, () => console.log("Server is running on the port " + process.env.PORT));

const io = new Server(server , {
    cors : {
        origin : "*"
    }
})

let connectedUser : string[]= []

io.on("connection" , function(socket) {
    console.log("User is connected" , socket.id);

    socket.on("setup" , (data)=>{
        // socket.userId = data;
        console.log( "setup", data);
        socket.join(data);
        if(!connectedUser.includes(data)) {
            connectedUser.push(data)
        }

        console.log("joined rooms" , Array.from(socket.rooms))
        const allRooms = io.sockets.adapter.rooms;

        socket.emit("available-users", connectedUser);

        for(let [room , sockets] of allRooms) {
            io.to(room).emit("user-connected" , data);
        }
    })

    socket.on("join-chat" , function(roomId) {
        socket.join(roomId);
        console.log("join-chat" , roomId)
    })

    socket.on("typing" , (room)=> {
        socket.to(room).emit("typing", true)
    })

    socket.on("stop-typing", (room)=>{
        socket.to(room).emit("stop typing" , true)
    })

    socket.on("leave-group", (room)=>{
        socket.leave(room);
    })

    socket.on("new-message" , (data)=>{
        console.log("new-message" , data)
        socket.to(data.roomId).emit("new-message" , data);
    })

    socket.on("disconnecting" , ()=> {
        const SocketRooms = Array.from(socket.rooms)
        console.log("socket-rooms" , SocketRooms)
        console.log("user disconnected", SocketRooms[1]);

        //here i am removing the user
        for(let i = 0; i < connectedUser.length; i++) {
            if(connectedUser[i] == SocketRooms[1]) {
                connectedUser.splice(i , 1);
                break;
            }
        }

        for(let i = 0; i < SocketRooms.length; i++) {
            console.log(SocketRooms[i])
            io.to(SocketRooms[i]).emit("user-disconnected" , SocketRooms[1]);
        }
    })
    
    socket.on("disconnect" , ()=>{
        console.log("someone-isdisconnected");
    })


})
