let lastSelectedID = "A1";
let lastSelectedColor = "#E63462";
let score = 0;
let bonus = 1;
let currentLetters = new Array();
let avaibleLetters = new Array();


// class letterScore {
//     constructor(field, value, letter, isNew = true) {
//         this.field = field;
//         let obj = fieldsValues.find(x => x.field == field);
//         this.letter = letter;
//         if (isNew) {
//             switch (obj.fieldClass) {
//                 case 'tripleWord':
//                     this.wordBonus = 3;
//                     this.letterBonus = 1;
//                     break;
//                 case 'doubleWord':
//                     this.wordBonus = 2;
//                     this.letterBonus = 1;
//                     break;
//                 case 'tripleLetter':
//                     this.wordBonus = 1;
//                     this.letterBonus = 3;
//                     break;
//                 case 'doubleLetter':
//                     this.wordBonus = 1;
//                     this.letterBonus = 2;
//                     break;
//                 default:
//                     this.wordBonus = 1;
//                     this.letterBonus = 1;
//             }
//         } else {
//             this.wordBonus = 1;
//             this.letterBonus = 1;
//         }

//         this.value = this.letterBonus * value;
//         this.isNew = isNew;
//     }
// }

function selectField() {
    lostFocus();
    let obj = document.getElementById(this.id);
    obj.style.backgroundColor = 'white';
    obj.style.opacity = 0.5;
    lastSelectedID = this.id;
}

function lostFocus() {
    let obj = document.getElementById(lastSelectedID);
    obj.removeAttribute('style');
}

function setFocus() {
    let obj = document.getElementById(lastSelectedID);
    obj.style.backgroundColor = 'white';
    obj.style.opacity = 0.5;
}

function selectNewWord(isCorrectWord, data, score = 0, scoreBefore = 0) {

    data.forEach(x => {
        const arr = x.fields.split(',');
        arr.forEach(id => {
            let obj = document.getElementById(id);
            if (obj.childElementCount > 0) {
                obj.firstElementChild.firstElementChild.classList.add('new');
            }
        })
    });

    let elements = document.getElementsByClassName('new');
    elements = Array.from(elements);
    elements.forEach(x => {
        if (isCorrectWord) {
            x.parentNode.style.backgroundColor = '#4BB543';
        } else {
            x.parentNode.style.backgroundColor = '#ff0033';
        }

        x.classList.remove('new');

        x.classList.add('cover');

        setTimeout(function () {
            x.classList.remove('cover');
            x.classList.add('uncover');
        }, 600);


        setTimeout(function () {
            x.classList.remove('uncover');
        }, 1200);
    });
    if (isCorrectWord) {
        let obj = document.getElementsByClassName('timer')[0];
        obj.setAttribute('data-from', obj.innerText);
        obj.setAttribute('data-to', `${score}`);

        let countData = {
            from: scoreBefore,
            to: score,
            speed: 500,
            refreshInterval: 30,
            decimals: 0
        };
        setTimeout(function () {
            $('.timer').countTo(countData);
        }, 300);
        currentLetters.length = 0;

    } else {
        let temp = [];
        currentLetters.forEach(x => {
            if (x.isNew) {
                temp.push(x);
            }
        });
        currentLetters = Array.from(temp);
    }
}

function insertNewLetters(newLetters) {
    let obj = document.getElementById('letters');
    let html = '';
    newLetters.forEach(x => {
        const lett = allLetters.find(item => item.letter == x);
        if (lett !== undefined) {
            html +=
                `<th class="sideBar-pole">
                <div class="letter-sideBar">
                <div class="letter wood">${lett.letter}<div class="letterValue">${lett.value}</div>
                </div>
                </div>
                </th>`;
        }
    })

    obj.innerHTML = html;
}

function checkPolishLetters(letter) {
    letter = letter.toUpperCase();

    switch (letter) {
        case 'S':
            return 'Ś';
        case 'L':
            return 'Ł';
        case 'A':
            return 'Ą';
        case 'E':
            return 'Ę';
        case 'O':
            return 'Ó';
        case 'C':
            return 'Ć';
        case 'Z':
            return 'Ż';
        case 'X':
            return 'Ź';
        case 'N':
            return 'Ń';
        default:
            return letter;
    }
}

function onStart() {
    getFields();
    getAllLettersValues();
    continueGame(1, 1243);

    let fields = document.getElementsByClassName("pole");
    Array.from(fields).forEach(function (element) {
        element.addEventListener('click', selectField, false);
    });

    //getLetters();
}
let allLetters;
let fieldsValues;
window.onload = onStart;
window.addEventListener('keydown', keyDownEvent, false);