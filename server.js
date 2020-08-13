const express = require("express");
const app = express();
const server = require('http').Server(app);
const io=require('socket.io')(server);
const {v4:uuidV4} = require("uuid");
app.set('view engine','ejs');
app.use(express.static('public'));



app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
});   
var ExpressPeerServer = require('peer').ExpressPeerServer;
var peerExpress = require('express');
var peerApp = peerExpress();
var peerServer = require('http').Server(peerApp);
var options = { debug: true }
var peerPort = 9000;

peerApp.use('/peerjs', ExpressPeerServer(peerServer, options));


app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on('connection',(socket)=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected",userId);

        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message);
        })
    });
})
server.listen(process.env.PORT||3030);  
peerServer.listen(process.env.PORT||peerPort);
