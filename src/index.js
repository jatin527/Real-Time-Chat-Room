const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT;
const sockerio = require('socket.io');
const Bad_words = require('bad-words');

const { generateMsg, generateLocationMsg } = require('./utils/messages');
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
} = require('./utils/users');

const publicpath = path.join(__dirname, '../public');

const app = express();

const server = http.createServer(app);
const io = sockerio(server);
app.use(express.static(publicpath));

io.on('connection', (socket) => {
	console.log('socket run');

	socket.on('join', (options, callback) => {
		const { error, user } = addUser({ id: socket.id, ...options });
		if (error) {
			return callback(error);
		}
		socket.join(user.room);
		socket.emit(
			'message',
			generateMsg('Admin', `Welcome ${user.username}!!`)
		);
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				generateMsg('Admin', `${user.username} has joined`)
			);

		io.to(user.room).emit('roomdata', {
			room: user.room,
			users: getUsersInRoom(user.room),
		});
	});

	socket.on('sendMsg', (message, callback) => {
		const filter = new Bad_words();
		if (filter.isProfane(message)) {
			return callback('Bad words used');
		}
		const user = getUser(socket.id);

		if (user) {
			io.to(user.room).emit(
				'message',
				generateMsg(user.username, message)
			);
			callback('Delivered!');
		}
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit(
				'message',
				generateMsg('Admin', `${user.username} left`)
			);
			io.to(user.room).emit('roomdata', {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
		}
	});

	socket.on('sendLocation', (location, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit(
			'locationMsg',
			generateLocationMsg(user.username, location)
		);
		callback('Location Sent!!');
	});
});

server.listen(port, () => console.log(`server is up on port ${port}`));
