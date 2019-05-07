const express = require('express');
const options = require('./../actions/options.js');
const mysql = require('./../actions/mysql.js');
const logic = require('./../actions/logic.js');
const qo = require('./../actions/queryObject.js');
const router = express.Router();

const db = new mysql({
    host: options.storageConfig.host,
    database: options.storageConfig.database,
    port: options.storageConfig.port,
    user: options.storageConfig.user,
    password: options.storageConfig.password
})

router.post('/newword/:currentLetters', (req, res) => {

    let currentLetters = JSON.parse(req.params.currentLetters);
    let userId = 1;
    let gameId = 1243;
    let queryData, board, rules, queryResult;

    let query = `SELECT * FROM games_history WHERE user_id = '${userId}' AND game_id = '${gameId}' ORDER BY round DESC LIMIT 1`;
    db.query(query)
        .then(result => {
            queryResult = result;
            queryData = JSON.parse(JSON.stringify(queryResult[0]));
        })
        .then(() => {
            rules = new logic(currentLetters, queryData.board);
            if (queryData.round === 0) {
                rules.isStartFieldFilled();
            }
            rules.haveTheLettersChanged(queryData.user_letters);
            rules.areLettersInOneDirection();
            rules.getPossibleWords();

            board = rules.board;
            //let words = rules.words;
            let counter = 0;
            rules.words.forEach(x => {
                query = `SELECT * FROM words WHERE word = '${x.word}'`;
                db.query(query).then(result => {
                        if (result[0] === undefined) {
                            throw {
                                msg: `Słowo ${x.word} nie istnieje!`,
                                fields: x.fields
                            }
                        }
                        counter++;
                        //przerobic na promises
                        if (counter == rules.words.length) {
                            let queryObject = new qo(queryData, currentLetters);
                            query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
							VALUES('${queryObject.gameId}','${queryObject.time}',1,0,${queryObject.round},'${JSON.stringify(board)}','${queryObject.newLetters}','${queryObject.bag}')`;
                            db.query(query).then(() => {
                                res.json({
                                    data: JSON.stringify(rules.words),
                                    newLetters: queryObject.newLetters
                                });
                            });
                        }
                    })
                    .catch(err => {
                        return res.status(400).json(err);
                    })
            });

        })
        .catch(err => {
            return res.status(400).json(err);
        });
});

module.exports = router;