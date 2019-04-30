var moment = require('moment');
var lettersOperations = require('./data.js');

module.exports = class queryObject {
    constructor(data, currentLetters) {
        this.gameId = data.gameId;
        this.round = new Number(data.round) + 1;
        this.time = moment().format("YYYY-MM-DD HH:mm:ss");
        getNewLetters(data.user_letters.split(''),
            currentLetters.map(x => x.letter),
            data.avaible_letters.split(','));
    }

    getNewLetters(userLetters, lettersUsed, bag) {
        let item = lettersOperations.getRandomLetters(bag, lettersUsed.length);

        lettersUsed.forEach(x => {
            let index = userLetters.findIndex(a => a == x);
            userLetters.splice(index, 1);
        });

        this.newLetters = userLetters.join('').concat(item.letters.join(''));
        this.bag = item.bag;
    }
}

function getNewLetters(oldLetters, bag) {
    let item = lettersOperations.getRandomLetters(bag, oldLetters);

}