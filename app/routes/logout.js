const express = require('express');
const path = require('path');
const db = require('./../actions/db.js');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.sendFile(path.join(__dirname + './../public/login.html'));
});

module.exports = router;