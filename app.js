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

  // socket.on('join', ({roomName}) => {
  //   console.log(roomName, "room Name from join socket")
  //   thread.findByRoomName(roomName).then(room => {
  //     console.log(room, "found room")
  //   }).catch(error => console.log(error))
  // })



  // socket for login user
  
  // When The client first load joinRoom page, client sends username from user's local storage
  socket.on("sendUserNameForConnectedRooms", (username) => {
// uses username to get user Id from users table
    users.findByUserName(username).then(user => {
      let idForUserSearch = user[0].id
// uses user id to find all threads the user has joined in the past.
      thread.findByUserId(idForUserSearch).then(rooms => {
// this emit send the users room back to the client
        socket.emit("preRoom", (rooms))
      }).catch(error => {
        console.log(error, "no rooms")
      })

    }).catch((error)  => {
      console.log(error)})
  })


  socket.on("CreateNewRoom", (room) => {

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

          socket.emit('message', {user: 'admin', text: `Hello ${userName}! You have created the ${roomName} room!`})
          // socket.join(roomName)
    
        }).catch(err => console.log(err, "room was not created"))
   
   }).catch((error)  => {
     console.log(error)})
  })

  socket.on("join", (selectedRoomName) => {
    const {roomName, userName} = selectedRoomName
    console.log(roomName, "room Name from join socket")
    console.log(userName, "userName  from join socket")

    thread.findByRoomName(roomName).then(room => {
      console.log(room, "found room")
      socket.join(room[0].roomId)


      socket.emit('message', {user: 'admin', text: `Hello ${userName} ! Welcome to the ${room[0].name} room!`})
      console.log(`Hello ${userName}! Welcome to the ${room[0].name} room!`)

      socket.broadcast.to(room[0].roomId).emit('message',{user: 'admin', text: `${userName} has join the chat`})




    }).catch(error => console.log(error))
  })

  socket.on('newMessage', ({message, userName, roomName}) => {

    users.findByUserName(userName)
    .then(user => {
      const userId = user[0].id

      thread.findByRoomName(roomName).then(roomData => {
        console.log(roomData, "roomData")
        const roomId = roomData[0].roomId
        NewMessageObg = {
          roomId: roomId,
          userId: userId,
          line: message
        };
        thread.addto(NewMessageObg).then(message => {
          console.log(message, "meesage Res")
         const threadId = message[0].id
          thread
          .findByRoomId(roomId)
          .then((threadToBeReturned) => {
            console.log(threadToBeReturned, "35");
            console.log(roomName, "roomName be emitted to")
            io.to(roomName).emit("thread", {message: threadToBeReturned, userName: userName});
          })
          .catch((err) => console.log({ err: "no lins" }));


        }).catch(error => console.log(error))


      })

   
   }).catch((error)  => {
    console.log(error)})
    


  })


  socket.on('refresh', (roomName) => {
    console.log(roomName,"refreash")
    thread.findByRoomName(roomName).then(roomData => {
      console.log(roomData, "roomData")
      console.log(roomName, "roomName be emitted to")
      const roomId = roomData[0].roomId

      thread
        .findByRoomId(roomId)
        .then((threadToBeReturned) => {
          console.log(threadToBeReturned, "172");
          console.log(roomId, "copy")
          console.log(roomName, "173")

          io.to(threadToBeReturned[0].roomId).emit("thread", {message: threadToBeReturned, userName: null});
        })
        .catch((err) => console.log(err));

    }).catch((err) => console.log(err))
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
          socket.emit("token", { Token: Token , username: user[0].username});
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

  socket.on("sent_meme", (pic) => {
    io.emit("returned_meme", pic);
  });

  // socket.on('delete',() => {
  //   thread.remove().then(x => {
  //       console.log("THREAD CLEARED")
  //   })
  //   .catch((err) => console.log(err, "error deleting thread"))
  // })


  socket.on("disconnect", () => {
    console.log(`Disconnected`);
  });

  count += 1;
});
