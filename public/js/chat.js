const socket = io();

document.getElementById('message-form').addEventListener('submit', (e) => {
	e.preventDefault();
	const message = document.getElementById('message').value;
	4;

	socket.emit('sendMsg', message, ()=>{
        console.log("message delivered");
    });
});

document.getElementById('send-location').addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert('Old version hia tera update maar browser ko');
	}
	navigator.geolocation.getCurrentPosition((position) => {
		const location = {
			lat: position.coords.latitude,
			long: position.coords.longitude,
		};
        socket.emit("sendLocation", location)
	});
});

socket.on('welcome', (welcomeMsg) => {
	console.log(welcomeMsg);
});
socket.on('MsgRecieved', (Msg) => {
	console.log(Msg);
});
