'use strict';

const net = require('net');
const server = net.createServer();

let clientPool = [];

let Client = function(socket, nickname){
  this.nickname = nickname;
  this.socket = socket;
};

// server.on('connection', (socket) => {
//   socket.write('hello socket, welcome to slugchat!\n')
//   socket.nickname = `user_${Math.random()}`
//   console.log(`${socket.nickname} connected!`)
//
//   clientPool = [...clientPool, socket];


server.on('connection', (socket) => { //socket callback invoked on connection
  let client = new Client(socket, `lion_cub_${Math.floor(Math.random() * (1000 - 1) + 1)}`);

  socket.write('hello socket, welcome to lionchat!\n');
  socket.nickname = client.nickname;
  console.log(`${socket.nickname} connected!`);
  clientPool = [...clientPool, client]; //same as push operation, mutable

  let handleDisconnect = () => {
    console.log(`${socket.nickname} left the chat.`);
    clientPool = clientPool.filter((item) => {
      item != socket;
    });
  };

  socket.on('error', handleDisconnect);

  socket.on('close', handleDisconnect);


  socket.on('data', (buffer) => {
    let data = buffer.toString();

    if(data.startsWith('/nick')) {
      socket.nickname = data.split('/nick ')[1] || socket.nickname;
      socket.nickname = socket.nickname.trim();
      client.nickname = socket.nickname;
      socket.write(`You've changed your name and become a real lion, Lion_${socket.nickname}!`);
      return;
    }

    if(data.startsWith('/dm')){
      let content = data.split('/dm ')[1] || ''; // should be first word after /dm
      content = content.trim();
      let to = content.split(' ')[0].trim();
      clientPool.forEach((user) => {
        if(to == user.nickname){
          user.socket.write(`${socket.nickname}: ${data.split(to)[1]}\n`);
        }
      });
      return;
    }

    if(data.startsWith('/troll')){
      let timesToWrite = dat.split('/troll ')[1]
    }

    //troll should take in a number and a message and send the message to everyone that number of times

    clientPool.forEach((user) => {
      user.socket.write(`${socket.nickname}: ${data}`);
    });
  });
});


server.listen(4000, () => {
  console.log('server up on port 3000');
});