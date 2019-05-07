const http = 'http://127.0.0.1:52922/';

function getAllLettersValues() {
    $.get(`${http}allletters`, function (result) {
        allLetters = Array.from(result.allLetters);
    })
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

function newWord(arr) {
    let temp = [];
    arr.forEach(x => {
        temp.push({
            field: x.field,
            letter: x.letter
        });
    });
    let uriPar = encodeURIComponent(JSON.stringify(temp));
    $.post(`${http}newword/${uriPar}`, function (result) {
            const data = JSON.parse(result.data);
            avaibleLetters = result.newLetters.split('');
            insertNewLetters(avaibleLetters);
            selectNewWord(true, data, 74, 33);
        })
        .fail(function (response) {
            const data = JSON.parse(response.responseText);
            alert(data.msg);
            if (data.fields !== undefined) {
                let arr = [];
                arr.push({
                    fields: data.fields
                });
                selectNewWord(false, arr);
            }

        });
}

function continueGame(userId, gameId) {
    $.get(`${http}continue/${userId}.${gameId}`, function (result) {

            let board = JSON.parse(result.board);
            board.forEach(x => {
                if (x.value != '') {
                    let letterObject = allLetters.find(el => el.letter == x.value);
                    let obj = document.getElementById(x.field);
                    obj.innerHTML = `<div class = "success"><div class="letter wood">${letterObject.letter}<div class="letterValue">${letterObject.value}</div></div></div>`;
                }
            });

            avaibleLetters = result.user_letters.split('');
            insertNewLetters(avaibleLetters);
        })
        .fail(function (response) {
            console.log(response);
        })
}