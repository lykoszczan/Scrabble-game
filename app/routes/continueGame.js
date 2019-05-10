const express = require('express');
const db = require('./../actions/db.js');
const router = express.Router();

router.get('/continue/:userId.:gameId', (req, res) => {
    let userId = JSON.parse(req.params.userId);
    let gameId = JSON.parse(req.params.gameId);
    let queryData;

    let query = `SELECT * FROM games_history WHERE user_id = '${db.connection.escape(userId)}' AND game_id = '${db.connection.escape(gameId)}' ORDER BY round DESC LIMIT 1`;
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

module.exports = router;