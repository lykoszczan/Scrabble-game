const data = require('./data');
const fields = require('./fields');

class letterScore {
    constructor(field, letter, isNew = false) {
        this.field = field;
        this.letter = letter;
        let item = fields.getfield(field);

        if (isNew) {
            switch (item.fieldClass) {
                case 'tripleWord':
                    this.wordBonus = 3;
                    this.letterBonus = 1;
                    break;
                case 'doubleWord':
                    this.wordBonus = 2;
                    this.letterBonus = 1;
                    break;
                case 'tripleLetter':
                    this.wordBonus = 1;
                    this.letterBonus = 3;
                    break;
                case 'doubleLetter':
                    this.wordBonus = 1;
                    this.letterBonus = 2;
                    break;
                default:
                    this.wordBonus = 1;
                    this.letterBonus = 1;
            }
        } else {
            this.wordBonus = 1;
            this.letterBonus = 1;
        }

        this.value = data.getLetterValues(letter).value;
        this.isNew = isNew;
    }
}

module.exports = class checkRules {

    constructor(letters, queryData) {
        this.currentLetters = [];
        this.user_letters = queryData.user_letters;
        this.isFirsMove = (queryData.round === 0);
        this.board = [];
        this.words = [];
        for (const letter in letters) {
            if (letters.hasOwnProperty(letter)) {
                const element = letters[letter];
                this.currentLetters.push(new letterScore(element.field, element.letter, true));
            }
        }

        let board = JSON.parse(queryData.board);
        let tempBoard = board.map(x => x.field);

        this.currentLetters.forEach(x => {
            let index = tempBoard.indexOf(x.field);
            board[index].value = x.letter;
        })

        for (const field in board) {
            if (board.hasOwnProperty(field)) {
                const element = board[field];
                this.board.push({
                    field: element.field,
                    value: element.value
                });
            }
        }
    }

    compareBoards(boardNew, boardOld) {
        let newfields = [];

        for (let i = 0; i < boardNew.lenght; i++) {
            if (JSON.stringify(boardNew[i]) !== JSON.stringify(boardOld[i])) {
                if (boardOld[i].value === '') {
                    newfields.push(boardNew[i]);
                }
            }
        }

        return newfields;
    }

    areLettersInOneDirection() {
        function isHorizontal(element, index, array) {
            return (element.field[0] === array[0].field[0]);
        }

        function isVertical(element, index, array) {
            return (element.field.slice(1) === array[0].field.slice(1));
        }

        let rowsEqual = this.currentLetters.every(isHorizontal);
        let columnsEqual = this.currentLetters.every(isVertical);

        if (!(rowsEqual || columnsEqual)) {
            throw {
                msg: 'Litery mogą być ułożone tylko w jednym poziomie'
            };
        }
    }

    haveTheLettersChanged() {
        let dbLetters = this.user_letters.split('');
        var BreakException = {};
        let found = true;

        try {
            this.currentLetters.forEach(x => {
                let index = dbLetters.indexOf(x.letter);
                if (index >= 0) {
                    dbLetters.splice(index, 1);
                } else {
                    found = false;
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        if (!found) {
            throw {
                msg: 'Zostały wprowadzone litery różne od przypisanych!'
            };
        }
    }

    isStartFieldFilled() {
        if (this.currentLetters.find(x => x.field == 'H8')) {
            return true;
        } else {
            throw {
                msg: "Pole Start musi zostać wypełnione!"
            };
        }
    }

    getPossibleWords() {
        if (this.currentLetters.length == 0) {
            throw {
                msg: "Brak liter!"
            };
        }

        this.currentLetters.sort(function (a, b) {
            return a.field.length - b.field.length ||
                a.field.localeCompare(b.field);
        });

        let possibleWords = [];

        if (this.isFirsMove) {
            let wordScore = 0;
            let wordBonus = 1;

            this.currentLetters.forEach(x => {
                wordScore += x.value * x.letterBonus;
                wordBonus *= x.wordBonus;
            });

            wordScore = wordScore * wordBonus;

            possibleWords.push({
                word: this.currentLetters.map(e => e.letter).join(""),
                fields: this.currentLetters.map(e => e.field).join(","),
                score: wordScore
            });
        } else {
            this.currentLetters.forEach(x => {
                let wordHorz = getHorzWord(x, this.board, this.currentLetters);
                if (wordHorz.word.length > 0 && possibleWords.findIndex(x => x.fields == wordHorz.fields) < 0) {
                    possibleWords.push(wordHorz);
                }
                let wordVert = getVertWord(x, this.board, this.currentLetters);
                if (wordVert.word.length > 0 && possibleWords.findIndex(x => x.fields == wordVert.fields) < 0) {
                    possibleWords.push(wordVert);
                }
            });
        }
        this.score = possibleWords.sum("score");
        this.words = Array.from(possibleWords);
    }
}

Array.prototype.sum = function (prop) {
    let total = 0
    for (let i = 0, _len = this.length; i < _len; i++) {
        total += this[i][prop]
    }
    return total;
}

function getVertWord(currentLetter, board, arr) {

    let fieldsVert = [];
    let hasLettersOnEnds;
    let element = currentLetter.field;
    //sprawdzenie w góre
    do {
        hasLettersOnEnds = false;
        if (element.slice(0, 1).charCodeAt(0) - 1 >= 'A'.charCodeAt(0)) {
            let id = String.fromCharCode(element.slice(0, 1).charCodeAt(0) - 1).concat(element.slice(1));

            let item = board.find(x => x.field == id);
            let fieldValue = item.value;

            if (fieldValue !== "") {
                if (arr.findIndex(x => x.field == id) < 0) {
                    fieldsVert.push(new letterScore(id, fieldValue, false));
                }
                hasLettersOnEnds = true;
                element = id;
            }
        }
    } while (hasLettersOnEnds);

    element = currentLetter.field;
    //sprawdzenie w dół        
    do {
        hasLettersOnEnds = false;
        if (element.slice(0, 1).charCodeAt(0) + 1 <= 'O'.charCodeAt(0)) {
            let id = String.fromCharCode(element.slice(0, 1).charCodeAt(0) + 1).concat(element.slice(1));

            let item = board.find(x => x.field == id);
            let fieldValue = item.value;
            if (fieldValue !== "") {
                if (arr.findIndex(x => x.field == id) < 0) {
                    fieldsVert.push(new letterScore(id, fieldValue, false));
                }
                hasLettersOnEnds = true;
                element = id;
            }
        }
    } while (hasLettersOnEnds);

    let wordScore = 0;
    let wordBonus = 1;
    if (fieldsVert.length > 0) {
        const vertLetters = arr.filter(x => x.field.slice(1) == fieldsVert[0].field.slice(1));
        fieldsVert = fieldsVert.concat(vertLetters);
        fieldsVert.sort(function (a, b) {
            return a.field.length - b.field.length ||
                a.field.localeCompare(b.field);
        });

        fieldsVert.forEach(x => {
            wordScore += x.value * x.letterBonus;
            wordBonus *= x.wordBonus;
        });

        wordScore = wordScore * wordBonus;
    }

    return {
        word: fieldsVert.map(e => e.letter).join(""),
        fields: fieldsVert.map(e => e.field).join(","),
        score: wordScore
    };
}

function getHorzWord(currentLetter, board, arr) {
    let fieldsHorz = [];
    let hasLettersOnSides;
    let element = currentLetter.field;
    //sprawdzenie w prawo
    do {
        hasLettersOnSides = false;
        if (new Number(element.slice(1)) + 1 < 16) {
            let id = element.slice(0, 1).concat(new Number(element.slice(1)) + 1);

            let item = board.find(x => x.field == id);
            let fieldValue = item.value;

            if (fieldValue !== "") {
                if (arr.findIndex(x => x.field == id) < 0) {
                    fieldsHorz.push(new letterScore(id, fieldValue, false));
                }
                hasLettersOnSides = true;
                element = id;
            }
        }

    } while (hasLettersOnSides);

    //sprawdzenie w lewo
    element = currentLetter.field;
    do {
        hasLettersOnSides = false;
        if (new Number(element.slice(1)) - 1 > 0) {
            let id = element.slice(0, 1).concat(new Number(element.slice(1)) - 1);

            let item = board.find(x => x.field == id);
            let fieldValue = item.value;

            if (fieldValue !== "") {
                if (arr.findIndex(x => x.field == id) < 0) {
                    fieldsHorz.push(new letterScore(id, fieldValue, false));
                }
                hasLettersOnSides = true;
                element = id;
            }
        }
    } while (hasLettersOnSides);

    let wordScore = 0;
    let wordBonus = 1;
    if (fieldsHorz.length > 0) {
        const horzLetters = arr.filter(x => x.field.slice(0, 1) == fieldsHorz[0].field.slice(0, 1));
        fieldsHorz = fieldsHorz.concat(horzLetters);
        fieldsHorz.sort(function (a, b) {
            return a.field.length - b.field.length ||
                a.field.localeCompare(b.field);
        });

        fieldsHorz.forEach(x => {
            wordScore += x.value * x.letterBonus;
            wordBonus *= x.wordBonus;
        });

        wordScore = wordScore * wordBonus;
    }

    return {
        word: fieldsHorz.map(e => e.letter).join(""),
        fields: fieldsHorz.map(e => e.field).join(","),
        score: wordScore
    };
}