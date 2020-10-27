const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const users = require("./Models/users-model");
const thread = require("./Models/thread-model");
const userAuth = require("./routers/auth-router")
const Room = require("./Models/room-model")
const signToken = require('./helperFunctions/signToken')
const bcrypt = require('bcryptjs');
const Port = process.env.PORT || 5000;

// Token used to verify user
const Token = "dhgishglshgujdhlgfdjhgsjldfhgsiulrhgurlghdfj";

server.listen(Port, () => {
  console.log(`Listening at ${Port}`);
});


app.use(express.json());

app.use('/api/users', userAuth);

app.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

//  varable to count user connections
let count = 0;



io.on("connection", (socket) => {
  console.log(`New client connected ${count}`)

  socket.on("disconnect", () => {
    console.log(`Disconnected`);
  });
  // thread
  //   .findById()
  //   .then((message) => {
  //     console.log(message, "message")
  //     io.emit("thread", message);
  //   })
  //   .catch((err) => console.log({ message: "no lins" }));

  // socket for login user
  
  socket.on("selectRoom", (username) => {

    users.findByUserName(username).then(user => {
      let idForUserSearch = user[0].id

      thread.findByUserId(idForUserSearch).then(rooms => {
        socket.emit("preRoom", (rooms))
      }).catch(error => {
        console.log(error, "no rooms")
      })

    }).catch((error)  => {
      console.log(error)})
  })


socket.on("roomName", (room) => {

const {roomName, userName} = room
   
console.log(roomName, "roomName")
    const roomObj = {
      name: roomName
    }
    users.findByUserName(userName).then(user => {
      const userId = user[0].id

      Room.addRoom(roomObj).then(roomData => {
        const roomId = roomData[0].id
        const threadObj = {
          roomId: roomId,
          userId: userId,
          line: roomName
        }
    
          thread.startThread(threadObj).then(newThread => {
            console.log(newThread, "NewThread")
          }).catch(err => console.log(err))
    
        }).catch(err => console.log(err, "room was not created"))
   
   }).catch((error)  => {
     console.log(error)})
  })

  socket.on("selectedRoomName", (selectedRoomName) => {
    console.log(selectedRoomName, "selected room from front end")
  })



  socket.on("login", (credentials) => {
    const { creds} = credentials;
    const {username, password} = creds
    // user'd login credentials are sent to the user tbl the verify the username and password match
    users
      .findByUserName(username)
      .then((user) => {
        console.log(user[0].password, password, "checking");
        if (user[0].password == password) {
          socket.emit("token", { Token: Token , username: user[0].username });
        }
      })
      .catch((err) => console.log({ message: "error loging in" }));
  });


  // socket for registering new user
  socket.on("register", (credentials) => {
    const { username, password, avatar } = credentials;

    const userobj = {
      username: username,
      password: password,
      emailAddress: "none",
      image: avatar,
    };

    io.emit("log", username);
    users
      .addUser(userobj)
      .then((user) => {
        socket.emit("token", {
          Token: Token,
          username: user[0].username,
          avatar: user[0].image,
        });
      })
      .catch((err) => console.log({ message: "error adding User" }));
  });

  // socket.on("new message", (msg) => {
  //   console.log(msg, "MSG");
  //   line = {
  //     name: "MeMe Game",
  //     line: msg.message,
  //     user: msg.user,
  //   };
  //   thread
  //     .addto(line)
  //     .then((message) => {
  //       thread
  //         .findById()
  //         .then((message) => {
  //           console.log(message, "35");
  //           io.emit("thread", message);
  //         })
  //         .catch((err) => console.log({ message: "no lins" }));
  //     })
  //     .catch((err) => console.log({ message: "new message not sent" }));
  // });

  socket.on("sent_meme", (pic) => {
    io.emit("returned_meme", pic);
  });

  // socket.on('delete',() => {
  //   thread.remove().then(x => {
  //       console.log("THREAD CLEARED")
  //   })
  //   .catch((err) => console.log(err, "error deleting thread"))
  // })

  count += 1;
});
