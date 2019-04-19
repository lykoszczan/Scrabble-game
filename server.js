var express = require('express');
var mysql = require('mysql');
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

app.get('/letters', (req, res) => {
	var id = req.query.id;
	let letters = data.getLetters(id);
	res.send(letters);
})

app.get('/letterValues', (req, res) => {
	var letter = req.query.letter;
	let object = data.getLetterValues(letter);
	res.send(object);
})

app.get('/fields', (req, res) => {
	let str = fields.getfields();
	res.send(str);
})

var server = app.listen(52922, () => {
	console.log('server is running on port1', server.address().port);
});