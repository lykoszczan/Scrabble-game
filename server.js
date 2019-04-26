var express = require('express');
var moment = require('moment');
var app = express();
var bodyParser = require('body-parser');
var data = require('./server/data');
var fields = require('./server/fields');
var options = require('./server/options');
var mysql = require('./server/mysql.js');
var logic = require('./server/logic.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}))

var db = new mysql({
	host: options.storageConfig.host,
	database: options.storageConfig.database,
	port: options.storageConfig.port,
	user: options.storageConfig.user,
	password: options.storageConfig.password
})

app.use(express.static(__dirname + `/client`));
app.use("/public", express.static('public'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});



app.get('/words', (req, res) => {
	var id = req.query.id;
	console.log(id);
	sql = `SELECT * FROM words WHERE word = '${id}'`;
	db.query(sql)
		.then(result => res.send(result))
})

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

app.post('/newword/:currentLetters', (req, res) => {

	//let debug = '%5B%7B%22field%22%3A%22G8%22%2C%22value%22%3A%22T%22%7D%2C%7B%22field%22%3A%22I8%22%2C%22value%22%3A%22T%22%7D%2C%7B%22field%22%3A%22J8%22%2C%22value%22%3A%22A%22%7D%5D';
	let currentLetters = JSON.parse(req.params.currentLetters);
	//let currentLetters = JSON.parse(debug);

	let userId = 1;
	let gameId = 1243;

	let queryResult;

	let query = `SELECT * FROM games_history WHERE user_id = '${userId}' AND game_id = '${gameId}' ORDER BY round LIMIT 1`;
	db.query(query)
		.then(result => {
			queryResult = result;
		})
		.then(() => {

			let data = JSON.parse(JSON.stringify(queryResult[0]));

			let rules = new logic(currentLetters, data.board);
			if (data.round === 0) {
				rules.isStartFieldFilled(res);
			}
			//rules.haveTheLettersChanged(res, data.user_letters);
			rules.areLettersInOneDirection(res);
			rules.isCorrectWord(res);

		});

});

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

let server = app.listen(52922, () => {
	console.log('server is running on port1', server.address().port);
});