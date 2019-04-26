var data = require('./data');
var fields = require('./fields');

module.exports = class checkRules {

    constructor(letters, board) {
        this.currentLetters = [];
        this.board = [];
        for (const letter in letters) {
            if (letters.hasOwnProperty(letter)) {
                const element = letters[letter];
                this.currentLetters.push(new letterScore(element.field, element.letter, true));
            }
        }

        board = JSON.parse(board);
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

    areLettersInOneDirection(res) {
        function isHorizontal(element, index, array) {
            return (element.field[0] === array[0].field[0]);
        }

        function isVertical(element, index, array) {
            return (element.field.slice(1) === array[0].field.slice(1));
        }

        let rowsEqual = this.currentLetters.every(isHorizontal);
        let columnsEqual = this.currentLetters.every(isVertical);

        if (!(rowsEqual || columnsEqual)) {
            return res.status(400).send('Litery mogą być ułożone tylko w jednym poziomie');
        }
    }

    haveTheLettersChanged(res, user_letters) {
        let dbLetters = user_letters.split('');
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
            return res.status(400).send('Zostały wprowadzone litery różne od przypisanych!');
        }
    }

    isStartFieldFilled(res) {
        if (this.currentLetters.find(x => x.field == 'H8')) {
            return true;
        } else {
            return res.status(400).send('Pole Start musi zostać wypełnione!');
        }
    }

    isCorrectWord(res) {
        this.currentLetters.sort(function (a, b) {
            return a.field.length - b.field.length ||
                a.field.localeCompare(b.field);
        });

        let possibleWords = [];

        console.log(this.board.find(x => x.value != ''));

        this.currentLetters.forEach(x => {
            let wordHorz = getHorzWord(x, this.board);
            if (wordHorz.length > 0 && possibleWords.findIndex(x => x == wordHorz) < 0) {
                possibleWords.push(wordHorz);
            }
            let wordVert = getVertWord(x, this.board);
            if (wordVert.length > 0 && possibleWords.findIndex(x => x == wordVert) < 0) {
                possibleWords.push(wordVert);
            }

        });


        console.log(possibleWords);
    }
}

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

        this.value = data.getLetterValues(letter);
        this.isNew = isNew;
    }
}


function currentLettersPush(arr, field, letter, isNew = false) {
    let letterValue = data.getLetterValues(letter);
    let letterBonus;
    if (isNew) {
        letterBonus = fields.getfieldBonus(field);
    } else {
        letterBonus = 1;
    }
    arr.push({
        field: field,
        letter: letter,
        letterValue: letterValue.value,
        fieldClass: letterBonus
    });
}

function getVertWord(currentLetter, board) {

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

            if (fieldValue.lenght > 0) {
                if (this.currentLetters.findIndex(x => x.field == id) < 0) {
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

            if (fieldValue.lenght > 0) {
                if (this.currentLetters.findIndex(x => x.field == id) < 0) {
                    fieldsVert.push(new letterScore(id, fieldValue, false));
                }
                hasLettersOnEnds = true;
                element = id;
            }
        }
    } while (hasLettersOnEnds);

    if (fieldsVert.length > 0) {
        fieldsVert = fieldsVert.concat(this.currentLetters);
        fieldsVert.sort(function (a, b) {
            return a.field.length - b.field.length ||
                a.field.localeCompare(b.field);
        });
    }

    return fieldsVert.map(e => e.letter).join("");
}

function getHorzWord(currentLetter, board) {
    let fieldsHorz = [];
    let hasLettersOnSides
    let element = currentLetter.field;
    //sprawdzenie w prawo
    do {
        hasLettersOnSides = false;
        if (new Number(element.slice(1)) + 1 < 16) {
            let id = element.slice(0, 1).concat(new Number(element.slice(1)) + 1);

            let item = board.find(x => x.field == id);
            let fieldValue = item.value;

            if (fieldValue.lenght > 0) {
                if (this.currentLetters.findIndex(x => x.field == id) < 0) {
                    fieldsVert.push(new letterScore(id, fieldValue, false));
                }
                hasLettersOnEnds = true;
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

            if (fieldValue.lenght > 0) {
                if (this.currentLetters.findIndex(x => x.field == id) < 0) {
                    fieldsVert.push(new letterScore(id, fieldValue, false));
                }
                hasLettersOnEnds = true;
                element = id;
            }

        }
    } while (hasLettersOnSides);


    if (fieldsHorz.length > 0) {
        fieldsHorz = fieldsHorz.concat(currentLetters);
        fieldsHorz.sort(function (a, b) {
            return a.field.length - b.field.length ||
                a.field.localeCompare(b.field);
        });
    }



    return fieldsHorz.map(e => e.letter).join("");
}