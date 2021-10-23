import { pieces } from './pieces.js'

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}
function clone(obj) {
    var copy;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}
function boardJson(board) {
    return board.flat().flat().map(square => {
        return (`${translate(square)},`)
    })
}
function translate(square) {
    if (!square) { return 0 }
    let c = 0
    if (!square.color) {
        c = 10
    }
    return c + square.type
}
function drawBoard() {
    let board = "";
    for (let i = 0; i < 9; i++) {
        board += "<tr>";
        for (let j = 0; j < 9; j++) {
            if ((i + j + 1) % 2 == 0 && i > 0 && j > 0) {
                board += "<td style='background-color:grey' class='square'>";
            }
            else {
                board += "<td class='square'>";
            }
            board += `<p id=${8 - i}${j - 1} onclick='processClick(this.id)'></td>`;
        }
    }
    board += "</tr>";

    document.getElementById("table").innerHTML = board;
    for (let i = 0; i < 8; i++) {
        document.getElementById("8" + i).innerHTML = String.fromCharCode(97 + i);
        document.getElementById(i + "-1").innerHTML = i + 1;
    }
}
function refresh(board) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const element = document.getElementById("" + i + j)
            if (board[i][j]) {
                element.innerHTML = board[i][j].bn;
            }
            else element.innerHTML = null;
        }
    }
}
function initialiseBoard(board) {
    board[0][0] = clone(pieces.wr);
    board[0][7] = clone(pieces.wr);
    board[7][0] = clone(pieces.br);
    board[7][7] = clone(pieces.br);
    board[0][1] = clone(pieces.wh);
    board[0][6] = clone(pieces.wh);
    board[7][1] = clone(pieces.bh);
    board[7][6] = clone(pieces.bh);
    board[0][2] = clone(pieces.wb);
    board[0][5] = clone(pieces.wb);
    board[7][2] = clone(pieces.bb);
    board[7][5] = clone(pieces.bb);
    board[0][4] = clone(pieces.wk);
    board[0][3] = clone(pieces.wq);
    board[7][4] = clone(pieces.bk);
    board[7][3] = clone(pieces.bq);
    for (let i = 0; i < 8; i++) {
        board[1][i] = clone(pieces.wp);
        board[6][i] = clone(pieces.bp);
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 8; j++) {
            board[i + 2][j] = null;
        }
    }
}

export { createArray, initialiseBoard, drawBoard, refresh, boardJson }