function keyDownEvent(e) {
    let keynum;
    let obj = document.getElementById(lastSelectedID);

    if (window.event) { // IE                    
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera                   
        keynum = e.which;
    }

    //escape or delete
    if ([27, 46].includes(keynum)) {

        let index = currentLetters.findIndex(x => x.field == lastSelectedID);
        if (index >= 0) {
            while (obj.firstChild) {
                obj.removeChild(obj.firstChild);
            }

            let undoLettter = currentLetters.splice(index, 1);
            // avaibleLetters.push({
            //     letter: undoLettter[0].letter,
            //     value: undoLettter[0].value
            // });
            avaibleLetters.push(undoLettter[0].letter);
            let fieldObj = fieldsValues.find(x => x.field == lastSelectedID);
            obj.innerText = fieldObj.text;
        }

        lostFocus();
        return;
    }
    //enter
    else if (keynum === 13) {

        if (currentLetters.length != 0) {
            lostFocus();
            newWord(currentLetters);
            return;
        }
    }
    //arrows
    else if ([37, 38, 39, 40].includes(keynum)) {
        let row = lastSelectedID[0];
        let column = lastSelectedID.slice(1);
        let charCode;
        switch (keynum) {
            case 37: //left
                lostFocus();
                (column == 1) ? column = 15: column--;
                lastSelectedID = row.concat(column);
                setFocus();
                break;
            case 39: //right
                lostFocus();
                (column == 15) ? column = 1: column++;
                lastSelectedID = row.concat(column);
                setFocus();
                break;
            case 38: //up
                lostFocus();
                charCode = row.charCodeAt(0);
                (row == 'A') ? row = 'O': row = String.fromCharCode(--charCode);
                lastSelectedID = row.concat(column);
                setFocus();
                break;
            case 40: //down
                lostFocus();
                charCode = row.charCodeAt(0);
                (row == 'O') ? row = 'A': row = String.fromCharCode(++charCode);
                lastSelectedID = row.concat(column);
                setFocus();
                break;
        }
        return;
    }

    let letter = String.fromCharCode(keynum);
    addLetter(letter, e);
}

function addLetter(letter, e) {
    let obj = document.getElementById(lastSelectedID);
    const regular = /^[A-Za-z]+$/;
    let index = currentLetters.findIndex(x => x.field == lastSelectedID);

    if (obj.childElementCount > 0 && index < 0) {
        return;
    }

    if (letter.match(regular)) {
        if (e.altKey) {
            letter = checkPolishLetters(letter);
        }
        let shouldReturn = false;
        let avaibleLetterIndex = avaibleLetters.findIndex(x => x == letter);
        (avaibleLetterIndex < 0) ? shouldReturn = true: avaibleLetters.splice(avaibleLetterIndex, 1);

        if (shouldReturn)
            return;

        //findLetter(letter);
        let letterObject = allLetters.find(x => x.letter = letter);
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
    }
}