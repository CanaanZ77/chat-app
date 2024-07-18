const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

io.on('connection', (socket) => {
    console.log('a user connected');
    
    // Send all previous messages to the new user
    Message.find().then(messages => {
        socket.emit('previousMessages', messages);
    });

    // Listen for incoming messages
    socket.on('chatMessage', (msg) => {
        const message = new Message({ username: msg.username, message: msg.message });
        message.save().then(() => {
            io.emit('chatMessage', msg);
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index
