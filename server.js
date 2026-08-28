const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Клієнт підключився:', socket.id);

  // Передача координат водія диспетчеру та усім іншим
  socket.on('driverLocation', (data) => {
    io.emit('driverLocation', data);
  });

  // Чат (Диспетчер <-> Водій)
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });

  // Нове замовлення
  socket.on('createOrder', (data) => {
    io.emit('newOrder', data);
  });

  socket.on('disconnect', () => {
    console.log('Клієнт відключився:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));
