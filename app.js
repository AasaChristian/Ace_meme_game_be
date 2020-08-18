const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const users = require("./Models/users-model");
const thread = require("./Models/thread-model");

// Token used to verify user
const Token = "dhgishglshgujdhlgfdjhgsjldfhgsiulrhgurlghdfj";

server.listen(process.env.PORT || 5000, () => {
  console.log("Listening at :5000...");
});

app.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

//  varable to count user connections
let count = 0;

io.on("connection", (socket) => {
  console.log(`New client connected ${count}`);

  io.emit("here", "Here")

  socket.on("disconnect", () => {
    console.log(`Disconnected`);
  });

  thread
    .findById()
    .then((message) => {
      io.emit("thread", message);
    })
    .catch((err) => console.log({ message: "no lins" }));

  // socket for login user
  socket.on("login", (credentials) => {
    const { username, password } = credentials;
    users
      .findByUserName(username)
      .then((user) => {
        console.log(user[0].password, password);
        if (user[0].password == password) {
          socket.emit("token", { Token: Token, username: user[0].username });
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

  socket.on("new message", (msg) => {
    console.log(msg, "MSG");
    line = {
      name: "MeMe Game",
      line: msg.message,
      user: msg.user,
    };
    thread
      .addto(line)
      .then((message) => {
        thread
          .findById()
          .then((message) => {
            console.log(message, "35");
            io.emit("thread", message);
          })
          .catch((err) => console.log({ message: "no lins" }));
      })
      .catch((err) => console.log({ message: "new message not sent" }));
  });

  socket.on("sent_meme", (pic) => {
    io.emit("returned_meme", pic);
  });

  socket.on('delete',() => {
    thread.remove().then(x => {
        console.log("THREAD CLEARED")
    })
    .catch((err) => console.log(err, "error deleting thread"))
  })

  count += 1;
});
