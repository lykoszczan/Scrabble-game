module.exports = {
    getLetters: function (id) {
        let min = 0;
        let max = allLetters.length - 1;
        let random;
        let letters = [];
        for (let i = 0; i < id; i++) {
            random = Math.floor(Math.random() * (+max - +min)) + +min;
            letters.push(allLetters[random]);
            allLetters.splice(random, 1);
            max = allLetters.length - 1;
        }
        console.log(allLetters.length);
        return letters;
        //debug
        //return allLetters.concat(letters);
    },

    getLetterValues: function (letter) {
        return LetterValues.find(x => x.letter == letter);
    }


}
var allLetters = [];

const LetterValues = [{
        letter: 'A',
        value: 1,
        count: 9
    },
    {
        letter: 'E',
        value: 1,
        count: 7
    },
    {
        letter: 'I',
        value: 1,
        count: 8
    },
    {
        letter: 'N',
        value: 1,
        count: 5
    },
    {
        letter: 'O',
        value: 1,
        count: 6
    },
    {
        letter: 'R',
        value: 1,
        count: 4
    },
    {
        letter: 'S',
        value: 1,
        count: 4
    },
    {
        letter: 'W',
        value: 1,
        count: 4
    },
    {
        letter: 'Z',
        value: 1,
        count: 5
    },
    {
        letter: 'C',
        value: 2,
        count: 3
    },
    {
        letter: 'D',
        value: 2,
        count: 3
    },
    {
        letter: 'K',
        value: 2,
        count: 3
    },
    {
        letter: 'L',
        value: 2,
        count: 3
    },
    {
        letter: 'M',
        value: 2,
        count: 3
    },
    {
        letter: 'P',
        value: 2,
        count: 3
    },
    {
        letter: 'T',
        value: 2,
        count: 3
    },
    {
        letter: 'Y',
        value: 2,
        count: 4
    },
    {
        letter: 'B',
        value: 3,
        count: 2
    },
    {
        letter: 'G',
        value: 3,
        count: 2
    },
    {
        letter: 'H',
        value: 3,
        count: 2
    },
    {
        letter: 'J',
        value: 3,
        count: 2
    },
    {
        letter: 'Ł',
        value: 3,
        count: 2
    },
    {
        letter: 'U',
        value: 3,
        count: 2
    },
    {
        letter: 'Ą',
        value: 5,
        count: 1
    },
    {
        letter: 'Ę',
        value: 5,
        count: 1
    },
    {
        letter: 'F',
        value: 5,
        count: 1
    },
    {
        letter: 'Ó',
        value: 5,
        count: 1
    },
    {
        letter: 'Ś',
        value: 5,
        count: 1
    },
    {
        letter: 'Ż',
        value: 5,
        count: 1
    },
    {
        letter: 'Ć',
        value: 6,
        count: 1
    },
    {
        letter: 'Ń',
        value: 7,
        count: 1
    },
    {
        letter: 'Ź',
        value: 9,
        count: 1
    }
]

LetterValues.forEach(x => {
    for (let i = 0; i < x.count; i++) {
        allLetters.push(x);
    }

})