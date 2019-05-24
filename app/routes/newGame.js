const express = require('express');
const db = require('./../actions/db.js');
const data = require('./../actions/data.js');
const fields = require('./../actions/fields.js');
const moment = require('moment');
const router = express.Router();

router.post('/newgame', (req, res) => {

    const userId = req.session.userId;
    let bag = data.getAllPossibleLetters();
    let board = fields.getfieldsLight();
    let time = moment().format("YYYY-MM-DD HH:mm:ss");
    let gameId, obj, letters, opponentId;
    db.query(`SELECT users.username, games.user1_id, games.game_id FROM users INNER JOIN games ON users.id = games.user1_id 
    WHERE games.user2_id IS NULL AND games.user1_id <> ? ORDER BY games.game_id ASC LIMIT 1`, [userId])
        .then(result => {
            if (result.length > 0) {
                gameId = result[0].game_id;
                opponentId = result[0].user1_id;
                db.query('UPDATE games SET user2_id = ? WHERE game_id = ?', [userId, gameId])
                    .then(result => {
                        req.session.gameId = gameId;
                        obj = data.getRandomLetters(bag);
                        bag = obj.bag;
                        letters = obj.letters.join("");
                        let query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
                         			VALUES('${gameId}','${time}',${opponentId},0,0,'${JSON.stringify(board)}','${letters}','${bag}')`;
                        db.query(query)
                            .then(result => {
                                obj = data.getRandomLetters(bag);
                                bag = obj.bag;
                                letters = obj.letters.join("");
                                let query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
                                VALUES('${gameId}','${time}',${userId},0,0,'${JSON.stringify(board)}','${letters}','${bag}')`;
                                db.query(query)
                                    .then(result => {
                                        res.json({
                                            userName: req.session.username,
                                            opponentName: opponentName,
                                            allLetters: letters,
                                            allFields: allFields,
                                            userScore: lastUserMove.user_score,
                                            opponentScore: 0,
                                            round: lastUserMove.round,
                                            board: lastUserMove.board,
                                            user_letters: lastUserMove.user_letters,
                                            bag: lastUserMove.avaible_letters
                                        });
                                    });
                            });
                    });
            } else {
                db.query('INSERT INTO games(user1_id) VALUES(?)', [userId])
                    .then(result => {
                        gameId = result.insertId;
                        req.session.gameId = gameId;
                    });
                res.json({
                    code: 0,
                    status: 'Oczekiwanie na przeciwnika'
                })
            }
        });





    // let bag = data.getAllPossibleLetters();
    // let board = fields.getfieldsLight();
    // let time = moment().format("YYYY-MM-DD HH:mm:ss");
    // let obj, letters, gameId;

    // let query = `INSERT INTO games(user1_id, user2_id) VALUES(1,2)`;

    // db.query(query)
    //     .then(result => {
    //         obj = data.getRandomLetters(bag);
    //         bag = obj.bag;
    //         letters = obj.letters.join("");
    //         gameId = result.insertId;
    //         query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
    // 			VALUES('${gameId}','${time}',1,0,0,'${JSON.stringify(board)}','${letters}','${bag}')`;
    //         db.query(query);
    //     })
    //     .then(result => {
    //         obj = data.getRandomLetters(bag);
    //         bag = obj.bag;
    //         letters = obj.letters.join("");
    //         query = `INSERT INTO games_history(game_id,time,user_id,user_score,round,board,user_letters,avaible_letters) 
    //         VALUES('${gameId}','${time}',2,0,0,'${JSON.stringify(board)}','${letters}','${bag}')`;
    //         db.query(query);
    //     })
    //     .then(() => {
    //         res.json({
    //             board: board
    //         });
    //     });
});

module.exports = router;