const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = ("cors");
const socketIO = require("socket.io");
const Message = require("./models/Message");
const app = exress();
const server = http.createServer(app);
const io = socketIO(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
},

app.use(cors()));
app.use(express.json());

mongoose.connect("",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
io.on("connection"), (socket)=>{
    consol.log("new connection connected");
    socket.on("chat Message", async(msgData)=>{
        const newMsg = new Message(msgData);
        await newMsg.save();
        io.emit("chat message",newMsg);
    })
    socket.io("disconnected",()=>{
        console.log("client disconnected");
    })
}

app.get("/messages", async(req,res)=>{
    const message = await Message.find();
    res.json(message);
});
server.listen(5000 , ()=>{
    console.log("server is running on http://localhost:5000")
});
