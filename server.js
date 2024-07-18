const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);  // Debug log
    io.emit('chat message', msg);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
