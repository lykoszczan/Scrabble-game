const http = 'http://10.0.24.112:52922/';

function CheckWord(word) {
    let isCorrectWord;
    $.get(`${http}words`, {
        id: word
    }, function (data) {
        (data[0]) ? isCorrectWord = true: isCorrectWord = false;
        selectNewWord(isCorrectWord, word);
    });
}

function getLetters() {
    let count = 7 - avaibleLetters.length;
    $.get(`${http}letters`, {
        count: count
    }, function (data) {
        console.log(data);
        avaibleLetters = avaibleLetters.concat(data);

        let obj = document.getElementById('letters');
        let html = '';
        avaibleLetters.forEach(x => {
            html +=
                `<th class="sideBar-pole">
            <div class="letter-sideBar">
              <div class="letter wood">${x.letter}<div class="letterValue">${x.value}</div>
              </div>
            </div>
            </th>`;
        })

        obj.innerHTML = html;

    });
}

function findLetter(letter) {
    $.get(`${http}letterValues`, {
        letter: letter
    }, function (letterObject) {
        let obj = document.getElementById(lastSelectedID);
        obj.innerHTML = `<div class = "success"><div class="letter wood new">${letterObject.letter}<div class="letterValue">${letterObject.value}</div></div></div>`;
        let index = currentLetters.findIndex(x => x.field == lastSelectedID);
        if (index > -1) {
            avaibleLetters.push({
                letter: currentLetters[index].letter,
                value: letterObject.value
            });
            currentLetters[index] = new letterScore(lastSelectedID, letterObject.value, letterObject.letter, true);
        } else {
            currentLetters.push(new letterScore(lastSelectedID, letterObject.value, letterObject.letter, true));
        }
    });
}

function getFields() {
    $.get(`${http}fields`, function (data) {
        fieldsValues = Array.from(data);

        fieldsValues.forEach(x => {
            const obj = document.getElementById(x.field);
            if (x.fieldClass) {
                obj.classList.add(x.fieldClass);
            }
            obj.innerText = x.text;
        })
    });
}

function newWord() {

    let temp = [];

    currentLetters.forEach(x => {
        temp.push({
            field: x.field,
            letter: x.letter
        });
    });

    // temp.push({
    //     field: 'G8',
    //     value: 'T'
    // }, {
    //     field: 'I8',
    //     value: 'T'
    // }, {
    //     field: 'J8',
    //     value: 'A'
    // })

    var uriPar = encodeURIComponent(JSON.stringify(temp));
    $.post(`${http}newword/${uriPar}`, function (result) {
            console.log(result);
        })
        .fail(function (response) {
            alert(response.responseText);
        });

}