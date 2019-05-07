const express = require('express');
const moment = require('moment');
const app = express();
const bodyParser = require('body-parser');
const data = require('./actions/data.js');
const fields = require('./actions/fields.js');
const options = require('./actions/options.js');
const mysql = require('./actions/mysql.js');
const logic = require('./actions/logic.js');
const qo = require('./actions/queryObject.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}))

const db = new mysql({
	host: options.storageConfig.host,
	database: options.storageConfig.database,
	port: options.storageConfig.port,
	user: options.storageConfig.user,
	password: options.storageConfig.password
})

app.use(express.static(__dirname + `/public`));
app.use("/public", express.static('public'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});



app.get('/words', (req, res) => {
	const id = req.query.id;
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

app.get('/continue/:userId.:gameId', (req, res) => {
	let userId = JSON.parse(req.params.userId);
	let gameId = JSON.parse(req.params.gameId);
	let queryData;

	let query = `SELECT * FROM games_history WHERE user_id = '${userId}' AND game_id = '${gameId}' ORDER BY round DESC LIMIT 1`;
	db.query(query)
		.then(result => {
			queryData = JSON.parse(JSON.stringify(result[0]));
		})
		.then(result => {
			res.json({
				score: queryData.user_score,
				round: queryData.round,
				board: queryData.board,
				user_letters: queryData.user_letters,
				bag: queryData.avaible_letters
			})
		});

});
const newWord = require('./routes/newWord.js');
app.use('/', newWord);
// app.post('/newword/:currentLetters', (req, res) => {

// 	let currentLetters = JSON.parse(req.params.currentLetters);
// 	let userId = 1;
// 	let gameId = 1243;
// 	let queryData, board, rules, queryResult;

// 	let query = `SELECT * FROM games_history WHERE user_id = '${userId}' AND game_id = '${gameId}' ORDER BY round DESC LIMIT 1`;
// 	db.query(query)
// 		.then(result => {
// 			queryResult = result;
// 			queryData = JSON.parse(JSON.stringify(queryResult[0]));
// 		})
// 		.then(() => {
// 			rules = new logic(currentLetters, queryData.board);
// 			if (queryData.round === 0) {
// 				rules.isStartFieldFilled();
// 			}
// 			rules.haveTheLettersChanged(queryData.user_letters);
// 			rules.areLettersInOneDirection();
// 			rules.getPossibleWords();

// 			board = rules.board;
// 			//let words = rules.words;
// 			let counter = 0;
// 			rules.words.forEach(x => {
// 				query = `SELECT * FROM words WHERE word = '${x.word}'`;
// 				db.query(query).then(result => {
// 						if (result[0] === undefined) {
// 							throw {
// 								msg: `Słowo ${x.word} nie istnieje!`,
// 								fields: x.fields
// 							}
// 						}
// 						counter++;
// 						//przerobic na promises
// 						if (counter == rules.words.length) {
// 							let queryObject = new qo(queryData, currentLetters);
// 							query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
// 							VALUES('${queryObject.gameId}','${queryObject.time}',1,0,${queryObject.round},'${JSON.stringify(board)}','${queryObject.newLetters}','${queryObject.bag}')`;
// 							db.query(query).then(() => {
// 								res.json({
// 									data: JSON.stringify(rules.words),
// 									newLetters: queryObject.newLetters
// 								});
// 							});
// 						}
// 					})
// 					.catch(err => {
// 						return res.status(400).json(err);
// 					})
// 			});

// 		})
// 		.catch(err => {
// 			return res.status(400).json(err);
// 		});
// });

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

let server = app.listen(52922, () => {
	console.log('server is running on port1', server.address().port);
});