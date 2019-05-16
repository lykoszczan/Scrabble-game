const express = require('express');
const path = require('path');
const db = require('./../actions/db.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();

router.post('/signin', (request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;
    if (username && password) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            db.query('INSERT INTO users(username,password,email) VALUES(?,?,?)', [username, hash, email])
                .then((results) => {
                    if (results.insertId) {
                        request.session.userId = results.insertId;
                        request.session.loggedin = true;
                        request.session.username = username;
                        response.redirect('/');
                    } else {
                        response.send('Incorrect Username and/or Password!');
                        response.end();
                    }
                })
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

router.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname + './../public/signin.html'));
});

module.exports = router;