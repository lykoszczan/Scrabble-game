var moment = require('moment');
var lettersOperations = require('./data.js');

module.exports = class queryObject {
    constructor(data, currentLetters) {
        this.newLetters;
        this.bag;
        this.scoreBefore = data.user_score;
        this.gameId = data.game_id;
        this.round = new Number(data.round) + 1;
        this.time = moment().format("YYYY-MM-DD HH:mm:ss");
        getNewLetters(this, data.user_letters.split(''),
            currentLetters.map(x => x.letter),
            data.avaible_letters.split(','));
    }
}

function getNewLetters(obj, userLetters, lettersUsed, bag) {
    let item = lettersOperations.getRandomLetters(bag, lettersUsed.length);

    lettersUsed.forEach(x => {
        let index = userLetters.findIndex(a => a == x);
        userLetters.splice(index, 1);
    });

    obj.newLetters = userLetters.join('').concat(item.letters.join(''));
    obj.bag = item.bag;
}