const app = require("express")();
const server = require("http").createServer(app);
const io = require('socket.io')(server)


server.listen(5000, () => {
    console.log("Listening at :5000...")
});

app.get("/", (req, res) => {
    res.send({response: "I am alive"}).status(200);
});

let count = 0
list = []

io.on("connection", socket => {
    console.log(`New client connected ${count}`);

    socket.on("disconnect",() => {
        console.log(`Disconnected`)
    });

    socket.on('new message', (msg) => {
        console.log(msg, "MSG")
        
        list.push(msg)
        console.log(list,"list")
        io.emit('thread', list)
    })
    socket.on('state', i => {
        io.emit('count', i)
    })



    
    count +=1
});






