const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve arquivos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Se não achar, manda o index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// LÓGICA DO WEBRTC
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });

  socket.on('offer', (offer, roomId) => {
    socket.to(roomId).emit('offer', offer);
  });
  
  socket.on('answer', (answer, roomId) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate, roomId) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
