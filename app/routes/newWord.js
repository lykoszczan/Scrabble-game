const express = require('express');
const db = require('./../actions/db.js');
const logic = require('./../actions/logic.js');
const queryObject = require('./../actions/queryObject.js');
const router = express.Router();

router.post('/newword/:currentLetters', (req, res) => {
    const io = req.app.get('socketio');
    let currentLetters = JSON.parse(req.params.currentLetters);
    let userId = 1;
    let gameId = 1243;
    let queryData, board, rules, queryResult;

    let query = `SELECT * FROM games_history WHERE user_id = '${db.connection.escape(userId)}' AND game_id = '${db.connection.escape(gameId)}' ORDER BY round DESC LIMIT 1`;
    db.query(query)
        .then(result => {
            queryResult = result;
            queryData = JSON.parse(JSON.stringify(queryResult[0]));
        })
        .then(() => {
            rules = new logic(currentLetters, queryData);
            if (queryData.round === 0) {
                rules.isStartFieldFilled();
            }
            rules.haveTheLettersChanged();
            rules.areLettersInOneDirection();
            rules.getPossibleWords();

            board = rules.board;
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
                        //TO DO: przerobic na promises
                        if (counter == rules.words.length) {
                            let qo = new queryObject(queryData, currentLetters);
                            const score = qo.scoreBefore + rules.score;
                            query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
							VALUES('${qo.gameId}','${qo.time}',1,${score},${qo.round},'${JSON.stringify(board)}','${qo.newLetters}','${qo.bag}')`;
                            db.query(query).then(() => {
                                io.emit('newword', JSON.stringify({
                                    letters: currentLetters,
                                    words: rules.words,
                                    score: score
                                }));

                                res.json({
                                    data: JSON.stringify(rules.words),
                                    score: score,
                                    newLetters: qo.newLetters
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