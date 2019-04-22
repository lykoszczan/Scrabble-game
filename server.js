var express = require('express');
var mysql = require('mysql');
var moment = require('moment');
var app = express();
var bodyParser = require('body-parser');
var data = require('./server/data');
var fields = require('./server/fields');
var options = require('./server/options');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}))


var con = mysql.createConnection({
	host: options.storageConfig.host,
	database: options.storageConfig.database,
	port: options.storageConfig.port,
	user: options.storageConfig.user,
	password: options.storageConfig.password
});

app.use(express.static(__dirname + `/client`));
app.use("/public", express.static('public'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

app.get('/words', (req, res) => {
	var id = req.query.id;
	console.log(id);
	sql = `SELECT * FROM words WHERE word = '${id}'`
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result)
		res.send(result);
	});

})

app.post('/newgame', (req, res) => {
	let board = fields.getfields();
	let letters = data.getLetters(7);
	letters = letters.map(e => e.letter).join(";");
	let time = moment().format("YYYY-MM-DD HH:mm:ss");

	let query = `INSERT INTO games(game_id, user1_id, user2_id, time_start, avaible_letters)`

	query = `INSERT INTO games_history(time,user1_score,user2_score,round,board,avaible_letters) 
				VALUES('${time}',0,0,0,'${JSON.stringify(board)}','${letters}')`;

	con.query(query, function (err, result) {
		if (err) throw err;

		res.json({
			letters: letters,
			board: board
		});
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
	let str = fields.getfields();
	res.send(str);
})

let server = app.listen(52922, () => {
	console.log('server is running on port1', server.address().port);
});