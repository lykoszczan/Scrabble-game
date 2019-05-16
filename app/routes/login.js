const express = require('express');
const path = require('path');
const db = require('./../actions/db.js');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/login', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        db.query('SELECT * FROM users WHERE username = ?', [username])
            .then((results) => {
                if (results.length > 0) {
                    const responseData = results[0];
                    bcrypt.compare(password, responseData.password, function (err, res) {
                        if (res === true) {
                            request.session.lastGameId = responseData.last_game_id;
                            request.session.userId = responseData.id;
                            request.session.loggedin = true;
                            request.session.username = username;
                            response.redirect('/');
                        } else {
                            response.send('Incorrect Username and/or Password!');
                        }
                        response.end();
                    });

                } else {
                    response.send('Incorrect Username and/or Password!');
                    response.end();
                }
            });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + './../public/login.html'));
});

module.exports = router;