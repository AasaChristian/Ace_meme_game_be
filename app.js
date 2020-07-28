const app = require("express")();
const server = require("http").createServer(app);
const io = require('socket.io')(server)
const axios = require("axios")

server.listen(5000, () => {
    console.log("Listening at :5000...")
});

app.get("/", (req, res) => {
    res.send({response: "I am alive"}).status(200);
});

let count = 0

io.on("connection", socket => {
    console.log(`New client connected ${count}`);

    socket.on('new message', (msg) => {
        console.log("HERE BE")
        console.log(msg, "MSG")
        io.emit('thread', msg)
    })
    
    socket.on('room', data => {
        console.log('room join')
        console.log(data, 'data')
        socket.join(data.room)
    });
    
    socket.on('leave room', data =>{
        console.log('leaving room')
        console.log(data, 'data')
        socket.leave(data.room)
    })

    socket.on('new message', data => {
        console.log(data.room,data.name, "data.room")
        socket.broadcast
        .to(data.room)
        .emit('receive message', data)
    })

    socket.on("disconnect",() => {
        console.log("Client Disconnected")
    });
    count +=1
});






