const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Нове підключення:', socket.id);

  // Оновлення геопозиції водія
  socket.on('updateLocation', (data) => {
    io.emit('driverLocation', data);
  });

socket.on('driverLocation', (data) => {
  io.emit('driverLocation', data);
});

  // 1. Створення замовлення диспетчером -> розсилка водіям
  socket.on('createOrder', (orderData) => {
    console.log('Нове замовлення:', orderData);
    io.emit('newOrder', orderData);
  });

  // 2. Водій прийняв замовлення -> сповіщаємо диспетчера
  socket.on('acceptOrder', (data) => {
    console.log(`Замовлення ${data.orderId} прийнято водієм ${data.driverId}`);
    io.emit('orderAccepted', data);
  });

  // 3. Чат -> пересилка повідомлень усім
  socket.on('sendMessage', (msgData) => {
    console.log('Повідомлення в чаті:', msgData);
    io.emit('receiveMessage', msgData);
  });

  socket.on('disconnect', () => {
    console.log('Відключено:', socket.id);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Сервер таксі запущено на порту 3000');
});
