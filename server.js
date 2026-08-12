const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.get('*', (req, res) => { 
  res.sendFile(path.join(__dirname, 'public/index.html')); 
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => socket.join(roomId));
  socket.on('offer', (offer, roomId) => socket.to(roomId).emit('offer', offer));
  socket.on('answer', (answer, roomId) => socket.to(roomId).emit('answer', answer));
});

server.listen(PORT, () => console.log('Rodando na porta', PORT));