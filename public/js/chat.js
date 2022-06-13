const socket = io();

const $messageForm = document.getElementById('message-form');
const $message = document.getElementById('message');
const $location = document.getElementById('send-location');
const $messageButton = $messageForm.querySelector('button');
const $messages = document.getElementById('messages');

//* Templates
const messagetemplate = document.getElementById('message-template').innerHTML;
const locationtemplate = document.getElementById('location-template').innerHTML;

$messageForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const message = $message.value;
	$messageButton.setAttribute('disabled', 'disabled');

	socket.emit('sendMsg', message, (ack) => {
		$messageButton.removeAttribute('disabled');
		$message.value = '';
		$message.focus();
		console.log(ack);
	});
});

$location.addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert('Old version hia tera update maar browser ko');
	}
	$location.setAttribute('disabled', 'disabled');
	navigator.geolocation.getCurrentPosition((position) => {
		const location = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
		socket.emit('sendLocation', location, (msg) => {
			$location.removeAttribute('disabled');
			console.log(msg);
		});
	});
});

// socket.on('message', (welcomeMsg) => {
// 	console.log(welcomeMsg);
// });

socket.on('message', (Msg) => {
	console.log(Msg);
	const html = Mustache.render(messagetemplate, {
		message: Msg.text,
		createdAt: moment(Msg.createdAt).format('HH:mm'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMsg', (location) => {
	const html = Mustache.render(locationtemplate, {
		location: location.url,
		createdAt: moment(location.createdAt).format('HH:mm'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
	console.log(location);
});
