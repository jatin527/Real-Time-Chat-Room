const users = [];

const addUser = ({ id, username, room }) => {
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	if (!username || !room) {
		return {
			error: 'Username or room is not provided',
		};
	}

	const existingUser = users.find((user) => {
		return user.username === username && user.room === room;
	});

	if (existingUser) {
		return {
			error: 'Username already exist in that room',
		};
	}
	const user = { id, username, room };
	users.push(user);
	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
	return { error: 'User not found' };
};
const getUser = (id) => {
	return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
	return users.filter((user) => user.room === room);
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
};
