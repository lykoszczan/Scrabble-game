const express = require('express');
const db = require('./../actions/db.js');
const data = require('./../actions/data.js');
const fields = require('./../actions/fields.js');
const router = express.Router();

router.get('/continue', (req, res) => {
    //co w przypadku kiedy user dopiero sie zarejestruje
    if (req.query.gameId !== "" || req.session.lastGameId !== undefined) {
        let gameId;
        (req.query.gameId !== "") ? gameId = req.query.gameId: gameId = req.session.lastGameId;

        let queryData, opponentId, opponentName;
        const letters = data.getAllLetterValues();
        const allFields = fields.getAllfields();
        db.query(`SELECT * FROM games WHERE game_id = ?`, [gameId])
            .then(result => {
                if (result.length > 0) {
                    queryData = JSON.parse(JSON.stringify(result[0]));
                    (queryData.user1_id == req.session.userId) ? opponentId = queryData.user2_id: opponentId = queryData.user1_id;
                    db.query('SELECT * FROM users WHERE id = ?', [opponentId])
                        .then(result => {
                            queryData = JSON.parse(JSON.stringify(result[0]));
                            opponentName = queryData.username;
                            db.query('SELECT * FROM games_history WHERE game_id = ? ORDER BY round DESC', [gameId])
                                .then(result => {
                                    if (result.length > 0) {
                                        const lastUserMove = result.find(x => x.user_id == req.session.userId);
                                        const lastOpponentMove = result.find(x => x.user_id == opponentId);
                                        req.session.gameId = gameId;
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
                                        })
                                    }
                                });
                        })
                }
            });
    } else {
        //res.sendFile(path.join(__dirname + './../public/mygames.html'));
    }
});

module.exports = router;