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
        });
    });
}

function newGame() {
    $.post(`${http}newgame`, function (result) {
            console.log(result);
        })
        .fail(function (result) {

        });
}

function newWord(letters) {
    let temp = [];
    letters.forEach(x => {
        temp.push({
            field: x.field,
            letter: x.letter
        });
    });
    const uriPar = encodeURIComponent(JSON.stringify(temp));
    $.post(`${http}newword/${uriPar}`, function (result) {
            const data = JSON.parse(result.data);
            avaibleLetters = result.newLetters.split('');
            insertNewLetters(avaibleLetters);
            selectNewWord(true, data, result.score);
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

function continueGame(gameId = '') {
    $.get(`${http}continue/`, {
            gameId: gameId
        }, function (result) {
            const board = JSON.parse(result.board);
            const username = document.getElementById('username');
            if (username && result.userName) {
                username.innerText = result.userName;
            }
            const opponentname = document.getElementById('opponentname');
            if (opponentname && result.opponentName) {
                opponentname.innerText = result.opponentName;
            }
            allLetters = Array.from(result.allLetters);
            fieldsValues = Array.from(result.allFields);
            avaibleLetters = result.user_letters.split('');

            fieldsValues.forEach(x => {
                const obj = document.getElementById(x.field);
                if (x.fieldClass) {
                    obj.classList.add(x.fieldClass);
                }
                obj.innerText = x.text;
            });

            board.forEach(x => {
                if (x.value != '') {
                    let letterObject = allLetters.find(el => el.letter == x.value);
                    const obj = document.getElementById(x.field);
                    obj.innerHTML = `<div class = "success"><div class="letter wood">${letterObject.letter}<div class="letterValue">${letterObject.value}</div></div></div>`;
                }
            });
            showScore(result.userScore, 0);
            insertNewLetters(avaibleLetters);
        })
        .fail(function (response) {
            console.log(response);
        })
}

function exchangeLetters(userId, gameId, letters) {

    let uriPar = encodeURIComponent(JSON.stringify({
        userId: userId,
        gameId: gameId,
        letters: letters
    }));
    $.get(`${http}exchangeletters/${uriPar}`, function (result) {
            avaibleLetters = result.newLetters.split('');
            insertNewLetters(avaibleLetters);
        })
        .fail(function (result) {
            const data = JSON.parse(result.responseText);
            alert(data.msg);
        })

}