const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const data = require('./actions/data.js');
const fields = require('./actions/fields.js');
const db = require('./actions/db.js');
const http = require('http').createServer(app);
const favicon = require('serve-favicon');
const io = require('socket.io')(http);
const port = process.env.PORT || 52922;

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

io.on('connection', (socket) => {
	console.log('a user is connected');
	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
})

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set('socketio', io);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(__dirname + `/public`));
app.use("/public", express.static('public'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const newWord = require('./routes/newWord.js');
const continueGame = require('./routes/continueGame.js');
const exchangeLetters = require('./routes/exchangeLetters.js');
const signin = require('./routes/signin.js');
const login = require('./routes/login.js');
const logout = require('./routes/logout.js');
const newgame = require('./routes/newgame.js')
app.use('/', newWord);
app.use('/', continueGame);
app.use('/', exchangeLetters);
app.use('/', signin);
app.use('/', login);
app.use('/', logout);
app.use('/', newgame);

app.get('/fields', (req, res) => {
	let str = fields.getAllfields();
	res.send(str);
})

app.get('/allletters', (req, res) => {
	const letters = data.getAllLetterValues();

	res.json({
		allLetters: letters
	});
})

app.get('/', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/public/board.html'));
	} else {
		response.redirect('/login');
	}
});



http.listen(52922, () => {
	console.log('server is running on port1', port);
});