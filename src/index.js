const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT;
const sockerio = require('socket.io');
const Filter = require('bad-words')

const publicpath = path.join(__dirname, '../public');

const app = express();

const server = http.createServer(app);
const io = sockerio(server);
app.use(express.static(publicpath));

welcomeMsg = 'Welcome!!!';

io.on('connection', (socket) => {
	console.log('sockert eun');

	socket.emit('welcome', welcomeMsg);
	socket.broadcast.emit('welcome', 'A new user joined');

	socket.on('sendMsg', (message, callback) => {
		io.emit('MsgRecieved', message);
		callback();
	});

	socket.on('disconnect', () => {
		io.emit('welcome', 'a user left');
	});

	socket.on('sendLocation', (location) => {
		io.emit(
			'welcome',
			`https://google.com/maps?q=${location.lat},${location.long}`
		);
	});
});

server.listen(port, () => console.log(`server is up on port ${port}`));
