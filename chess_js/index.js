import { drawBoard } from './utils.js'
import Changer from './changer.js'

drawBoard();
const changer = new Changer()

window.processButton = () => {
    const input = document.getElementById("input").value;
    if (input.length !== 2 && input.length !== 3) {
        document.getElementById("error").innerHTML = "Input must containt column letter and row"
        return
    }
    const x = parseInt(input[1] - 1)
    const y = parseInt(input[0].charCodeAt(0) - 97)
    let transformTo = 1;
    if (input.length == 3) {
        transformTo = input[2];
    }
    if (x < 0 || y < 0 || x > 7 || y > 7) {
        document.getElementById("error").innerHTML = "Input must point to board"
        return
    }
    document.getElementById("error").innerHTML = ""
    changer.change({ position: [parseInt(x), parseInt(y)], transformTo });
}
window.processClick = (coordinates) => {
    let x = parseInt(coordinates.slice(0, 1), 10);
    let y = parseInt(coordinates.slice(1, 2), 10);
    if (x >= 8 || isNaN(y))
        return
    changer.change({ position: [x, y] });
}