import { drawBoard } from './utils.js'
import Changer from './changer.js'

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


drawBoard();
const changer = new Changer({ whiteAI:urlParams.get('whiteAI'), blackAI:urlParams.get('blackAI'),tf})

window.processButton = () => {
    const input = document.getElementById("input").value;
    if (input.length !== 2 && input.length !== 3) {
        document.getElementById("error").innerHTML = "Input must containt column letter and row"
        return
    }
    const x = input[1] - 1
    const y = input[0].charCodeAt(0) - 97
    let transformTo = 1;
    if (input.length == 3) {
        transformTo = parseInt(input[2])
    }
    if (y < 0 || x > 7 || y > 7) {
        document.getElementById("error").innerHTML = "Input must point to board"
        return
    }
    if (transformTo < 1 || transformTo > 4) {
        document.getElementById("error").innerHTML = "Select valid piece to transform to"
        return
    }
    document.getElementById("error").innerHTML = ""
    changer.change({ position: [x, y], transformTo });
}
window.processClick = (coordinates) => {
    const x = parseInt(coordinates.slice(0, 1), 10);
    const y = parseInt(coordinates.slice(1, 2), 10);
    if (x > 7 || isNaN(y))
        return
    changer.change({ position: [x, y] });
}