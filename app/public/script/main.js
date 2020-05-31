const socket = io();
socket.on('newword', addNewWord);

let lastSelectedID = "A1";
let lastSelectedColor = "#E63462";
let currentLetters = new Array();
let avaibleLetters = new Array();
let allLetters;
let fieldsValues;
//TO DO: zmienic na const i wtedy promises, unikac zmiennych globalnych

function generateNewWordUri() {
    let temp = [];
    currentLetters.forEach(x => {
        temp.push({
            field: x.field,
            letter: x.letter
        });
    });
    const uriPar = encodeURIComponent(JSON.stringify(temp));
    console.log(`/newword/${uriPar}`);
}

function addNewWord(response) {
    response = JSON.parse(response);
    console.log(response);
    alert("nowe slowo");
    response.letters.forEach(x => {
        const obj = document.getElementById(x.field);
        const letterObject = allLetters.find(item => item.letter == x.letter);
        obj.innerHTML = `<div class = "success"><div class="letter wood">${letterObject.letter}<div class="letterValue">${letterObject.value}</div></div></div>`;
    });
    setTimeout(() => {
        selectNewWord(true, response.words, response.score);
        showScoreOpponent(response.score);
    }, 600);

}

function selectField() {
    lostFocus();
    let obj = document.getElementById(this.id);
    obj.style.backgroundColor = 'white';
    obj.style.opacity = 0.5;
    lastSelectedID = this.id;
}

function disableSideBarLeters() {

    let sidebarLetters = document.getElementsByClassName('sideBar-pole');
    sidebarLetters = Array.from(sidebarLetters);

    currentLetters.forEach(x => {
        const itemIndex = sidebarLetters.findIndex(letter => {
            return letter.querySelector('.letter').innerText.slice(0, 1) == x.letter;
        });
        const item = sidebarLetters[itemIndex];
        item.style.backgroundColor = 'red';
        item.style.opacity = 0.5;
        sidebarLetters.splice(itemIndex, 1);
    });

    sidebarLetters.forEach(x => {
        x.removeAttribute("style");
    });
}

function exchangeLettersClick() {
    let checkedLetters = document.getElementsByClassName('checked');
    checkedLetters = Array.from(checkedLetters);
    let letters = [];
    checkedLetters.forEach(x => {
        const letter = x.querySelector('.letter').innerText.slice(0, 1);
        letters.push(letter);
    });

    exchangeLetters(1, 1243, letters);
}

function selectSideBarLetter(e) {
    if (this.classList.contains('checked'))
        this.classList.remove('checked');
    else
        this.classList.add('checked');
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


        // setTimeout(function () {
        //     x.classList.remove('uncover');
        // }, 1200);
    });
    if (!isCorrectWord) {
        let temp = [];
        currentLetters.forEach(x => {
            if (x.isNew) {
                temp.push(x);
            }
        });
        currentLetters = Array.from(temp);
    }
}

function showScoreOpponent(score, scoreBefore) {
    const obj = document.getElementById('opponentScore');
    if (!scoreBefore)
        scoreBefore = new Number(obj.innerText);
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
        $('.opponentTimer').countTo(countData);
    }, 300);
}

function showScore(score, scoreBefore) {
    let obj = document.getElementById('userScore');
    if (!scoreBefore)
        scoreBefore = new Number(obj.innerText);
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
        $('.userTimer').countTo(countData);
    }, 300);
    currentLetters.length = 0;
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
    });
    obj.innerHTML = html;

    let sidebarLetters = document.getElementsByClassName('sideBar-pole');
    sidebarLetters = Array.from(sidebarLetters);
    sidebarLetters.forEach(x => {
        x.addEventListener('click', selectSideBarLetter, false);
    })
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
    // getFields();
    // getAllLettersValues();
    continueGame();

    let fields = document.getElementsByClassName("pole");
    Array.from(fields).forEach(function (element) {
        element.addEventListener('click', selectField, false);
    });

    let element = document.getElementById('changeLetters');
    element.addEventListener('click', exchangeLettersClick, false);
}

window.onload = onStart;
window.addEventListener('keydown', keyDownEvent, false);