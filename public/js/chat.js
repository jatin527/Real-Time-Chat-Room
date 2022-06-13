const socket = io();

const $messageForm = document.getElementById('message-form');
const $message = document.getElementById('message');
const $location = document.getElementById('send-location');
const $messageButton = $messageForm.querySelector('button');
const $messages = document.getElementById('messages');

//* Templates
const messagetemplate = document.getElementById('message-template').innerHTML;
const locationtemplate = document.getElementById('location-template').innerHTML;
const sidebartemplate = document.getElementById('sidebar-template').innerHTML;

// * Options
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

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

socket.on('roomdata', ({ room, users }) => {
	const html = Mustache.render(sidebartemplate, {
		users,
		room,
	});
	document.getElementById('sidebar').innerHTML = html;
});

const autoScroll = () => {
    const $newMessage = $messages.lastElementChild

    const newmsgStyle = getComputedStyle($newMessage)
    const newmsgmargin  = parseInt(newmsgStyle.marginBottom)
    const newMsgHeight = newmsgmargin + $newMessage.offsetHeight

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMsgHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
};

socket.on('message', (Msg) => {
	console.log(Msg);
	const html = Mustache.render(messagetemplate, {
		username: Msg.username,
		message: Msg.text,
		createdAt: moment(Msg.createdAt).format('HH:mm'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
	autoScroll();
});

socket.on('locationMsg', (location) => {
	const html = Mustache.render(locationtemplate, {
		username: location.username,
		location: location.url,
		createdAt: moment(location.createdAt).format('HH:mm'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
	console.log(location);
	autoScroll();
});

socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error);
		location.href = '/';
	}
});
