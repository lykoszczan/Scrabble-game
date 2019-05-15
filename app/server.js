const express = require('express');
const moment = require('moment');
const app = express();
const bodyParser = require('body-parser');
const data = require('./actions/data.js');
const fields = require('./actions/fields.js');
const db = require('./actions/db.js');
const http = require('http').createServer(app);
const io = require('socket.io')(http);


io.on('connection', (socket) => {
	console.log('a user is connected');
	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
})

app.set('socketio', io);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}))

app.use(express.static(__dirname + `/public`));
app.use("/public", express.static('public'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post('/newgame', (req, res) => {

	let bag = data.getAllPossibleLetters();
	let board = fields.getfieldsLight();
	let time = moment().format("YYYY-MM-DD HH:mm:ss");
	let obj, letters, gameId;

	let query = `INSERT INTO games(user1_id, user2_id) VALUES(1,2)`;

	db.query(query)
		.then(result => {
			obj = data.getRandomLetters(bag);
			bag = obj.bag;
			letters = obj.letters.join("");
			gameId = result.insertId;
			query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
				VALUES('${gameId}','${time}',1,0,0,'${JSON.stringify(board)}','${letters}','${bag}')`;
			db.query(query);
		})
		.then(result => {
			// obj = data.getRandomLetters(bag);
			// bag = obj.bag;
			// letters = obj.letters.join("");
			// query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
			// VALUES('${gameId}','${time}',2,0,0,'${JSON.stringify(board)}','${letters}','${bag}')`;
			// db.query(query);
		})
		.then(() => {
			res.json({
				board: board
			});
		});
});


const newWord = require('./routes/newWord.js');
const continueGame = require('./routes/continueGame.js');
const exchangeLetters = require('./routes/exchangeLetters.js');
app.use('/', newWord);
app.use('/', continueGame);
app.use('/', exchangeLetters);


app.get('/letters', (req, res) => {
	let count = req.query.count;
	let letters = data.getLetters(count);
	res.send(letters);
})

app.get('/letterValues', (req, res) => {
	let letter = req.query.letter;
	let object = data.getLetterValues(letter);
	res.send(object);
})

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

http.listen(52922, () => {
	console.log('server is running on port1', 52922);
});