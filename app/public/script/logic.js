// function getVertWord(currentLetter) {

//     let fieldsVert = [];
//     let hasLettersOnEnds;
//     let element = currentLetter.field;
//     //sprawdzenie w góre
//     do {
//         hasLettersOnEnds = false;
//         if (element.slice(0, 1).charCodeAt(0) - 1 >= 'A'.charCodeAt(0)) {
//             let id = String.fromCharCode(element.slice(0, 1).charCodeAt(0) - 1).concat(element.slice(1));
//             let obj = document.getElementById(id);
//             if (obj.childElementCount > 0) {
//                 let letter = obj.firstElementChild.textContent.slice(0, 1);
//                 let letterValue = obj.firstElementChild.textContent.slice(1);
//                 obj.firstElementChild.firstElementChild.classList.add('new');
//                 if (currentLetters.findIndex(x => x.field == id) < 0) {
//                     fieldsVert.push(new letterScore(id, letterValue, letter, false));
//                 }
//                 hasLettersOnEnds = true;
//                 element = id;
//             }
//         }
//     } while (hasLettersOnEnds);

//     element = currentLetter.field;
//     //sprawdzenie w dół        
//     do {
//         hasLettersOnEnds = false;
//         if (element.slice(0, 1).charCodeAt(0) + 1 <= 'O'.charCodeAt(0)) {
//             let id = String.fromCharCode(element.slice(0, 1).charCodeAt(0) + 1).concat(element.slice(1));
//             let obj = document.getElementById(id);
//             if (obj.childElementCount > 0) {
//                 let letter = obj.firstElementChild.textContent.slice(0, 1);
//                 let letterValue = obj.firstElementChild.textContent.slice(1);
//                 obj.firstElementChild.firstElementChild.classList.add('new');
//                 if (currentLetters.findIndex(x => x.field == id) < 0) {
//                     fieldsVert.push(new letterScore(id, letterValue, letter, false));
//                 }
//                 hasLettersOnEnds = true;
//                 element = id;
//             }
//         }
//     } while (hasLettersOnEnds);

//     if (fieldsVert.length > 0) {
//         fieldsVert = fieldsVert.concat(currentLetters);
//         fieldsVert.sort(function (a, b) {
//             return a.field.length - b.field.length ||
//                 a.field.localeCompare(b.field);
//         });
//     }

//     return fieldsVert.map(e => e.letter).join("");
// }

// function getHorzWord(currentLetter) {
//     let fieldsHorz = [];
//     let hasLettersOnEnds;
//     let element = currentLetter.field;

//     //sprawdzenie w prawo
//     do {
//         hasLettersOnSides = false;
//         if (new Number(element.slice(1)) + 1 < 16) {
//             let id = element.slice(0, 1).concat(new Number(element.slice(1)) + 1);
//             let obj = document.getElementById(id);
//             if (obj.childElementCount > 0) {
//                 let letter = obj.firstElementChild.textContent.slice(0, 1);
//                 let letterValue = obj.firstElementChild.textContent.slice(1);
//                 obj.firstElementChild.firstElementChild.classList.add('new');
//                 if (currentLetters.findIndex(x => x.field == id) < 0) {
//                     fieldsHorz.push(new letterScore(id, letterValue, letter, false));
//                 }
//                 hasLettersOnSides = true;
//                 element = id;
//             }
//         }

//     } while (hasLettersOnSides);

//     //sprawdzenie w lewo
//     element = currentLetter.field;
//     do {
//         hasLettersOnSides = false;
//         if (new Number(element.slice(1)) - 1 > 0) {
//             let id = element.slice(0, 1).concat(new Number(element.slice(1)) - 1);
//             let obj = document.getElementById(id);
//             if (obj.childElementCount > 0) {
//                 let letter = obj.firstElementChild.textContent.slice(0, 1);
//                 let letterValue = obj.firstElementChild.textContent.slice(1);
//                 obj.firstElementChild.firstElementChild.classList.add('new');
//                 if (currentLetters.findIndex(x => x.field == id) < 0) {
//                     fieldsHorz.push(new letterScore(id, letterValue, letter, false));
//                 }
//                 hasLettersOnSides = true;
//                 element = id;
//             }

//         }
//     } while (hasLettersOnSides);


//     if (fieldsHorz.length > 0) {
//         fieldsHorz = fieldsHorz.concat(currentLetters);
//         fieldsHorz.sort(function (a, b) {
//             return a.field.length - b.field.length ||
//                 a.field.localeCompare(b.field);
//         });
//     }



//     return fieldsHorz.map(e => e.letter).join("");
// }

// function getEmptyFields() {

//     currentLetters.sort(function (a, b) {
//         return a.field.length - b.field.length ||
//             a.field.localeCompare(b.field);
//     });

//     let possibleWords = [];

//     currentLetters.forEach(x => {
//         let wordHorz = getHorzWord(x);
//         if (wordHorz.length > 0 && possibleWords.findIndex(x => x == wordHorz) < 0) {
//             possibleWords.push(wordHorz);
//         }
//         let wordVert = getVertWord(x);
//         if (wordVert.length > 0 && possibleWords.findIndex(x => x == wordVert) < 0) {
//             possibleWords.push(wordVert);
//         }

//     });

//     return possibleWords;
// }