const express = require('express');
const db = require('./../actions/db.js');
const lettersOperations = require('./../actions/data.js');
const queryObject = require('./../actions/queryObject.js');
const router = express.Router();

router.get('/exchangeletters/:params', (req, res) => {
    const params = JSON.parse(req.params.params);
    let query = `SELECT * FROM games_history WHERE user_id = '${db.connection.escape(params.userId)}' AND game_id = '${db.connection.escape(params.gameId)}' ORDER BY round DESC LIMIT 1`;
    db.query(query)
        .then(result => {
            const queryData = JSON.parse(JSON.stringify(result[0]));
            const letters = queryData.user_letters.split('');
            if (params.letters.length == 0) {
                throw {
                    msg: 'Niepoprawna ilość liter do wymiany!'
                };
            }
            params.letters.forEach(x => {
                const index = letters.indexOf(x);
                if (index >= 0) {
                    letters.splice(index, 1);
                }
            });
            if (7 - letters.length !== params.letters.length) {
                throw {
                    msg: `Niepoprawne litery!`
                }
            }
            const bag = queryData.avaible_letters.concat(',', params.letters.join(','));
            const item = lettersOperations.getRandomLetters(bag.split(','), params.letters.length);
            const newLetters = letters.concat(item.letters).join('');

            let qo = new queryObject(queryData);
            query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
            VALUES('${qo.gameId}','${qo.time}',1,${qo.scoreBefore},${qo.round},'${queryData.board}','${newLetters}','${item.bag.join(',')}')`;
            db.query(query).then(() => {
                res.json({
                    newLetters: newLetters
                });
            })
        })
        .catch(err => {
            return res.status(400).json(err);
        });
});

module.exports = router;