const app = require("express")();
const server = require("http").createServer(app);
const io = require('socket.io')(server)

const Thread = require('./routers/thread-router')
const thread = require('./Models/thread-model')


server.listen(5000, () => {
    console.log("Listening at :5000...")
});

app.get("/", (req, res) => {
    res.send({response: "I am alive"}).status(200);
});

// app.use('/app', Thread)

let count = 0

let album = []


io.on("connection", socket => {
    console.log(`New client connected ${count}`);

    socket.on("disconnect",() => {
        console.log(`Disconnected`)
    });

    thread.findById()
        .then(message => {
            io.emit('thread', message)
        })
        .catch(err => res.json({message: "no lins"}))
        

    socket.on('new message', (msg) => {

        console.log(msg, "MSG")
        line = {
            name: "MeMe Game",
            line: msg.message,
            user: msg.user
        }

    thread.addto(line)
        .then(message => {

        })
        .catch(err => console.log({message: "new message not sent"}))


        let messageToSend;
    thread.findById()
        .then(message => {
            io.emit('thread', message)

        })
        .catch(err => res.json({message: "no lins"}))
        



    })
    socket.on('state', i => {
        io.emit('count', i)
    })

    socket.on('sent_meme', pic => {
        
        socket.broadcast.emit('returned_meme', pic)
    })



    
    count +=1
});






