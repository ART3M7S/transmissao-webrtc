const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname)); // serve o index.html

const salas = {};

io.on('connection', socket => {
  console.log('Conectou:', socket.id);

  socket.on('entrar-sala', sala => {
    socket.join(sala);
    salas[sala] = salas[sala] || [];
    salas[sala].push(socket.id);
    socket.to(sala).emit('usuario-entrou');
  });

  socket.on('offer', (data) => socket.to(data.sala).emit('offer', data));
  socket.on('answer', (data) => socket.to(data.sala).emit('answer', data));
  socket.on('candidate', (data) => socket.to(data.sala).emit('candidate', data));

  socket.on('disconnect', () => {
    console.log('Desconectou:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Servidor rodando na porta', PORT));