const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT;
const sockerio = require('socket.io');
const Bad_words = require('bad-words');

const { generateMsg, generateLocationMsg } = require('./utils/messages')

const publicpath = path.join(__dirname, '../public');

const app = express();

const server = http.createServer(app);
const io = sockerio(server);
app.use(express.static(publicpath));

io.on('connection', (socket) => {
	console.log('socket run');

	socket.emit('message', generateMsg("Welcome!!"));
	socket.broadcast.emit('message', generateMsg('A new user joined'));

	socket.on('sendMsg', (message, callback) => {
		const filter = new Bad_words();
		if (filter.isProfane(message)) {
			return callback('Bad words used');
		}
		io.emit('message', generateMsg(message));
		callback('Delivered!');
	});

	socket.on('disconnect', () => {
		io.emit('message', generateMsg('a user left'));
	});

	socket.on('sendLocation', (location, callback) => {
		io.emit('locationMsg', generateLocationMsg(location));
		callback('Location Sent!!');
	});
});

server.listen(port, () => console.log(`server is up on port ${port}`));
