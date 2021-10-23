import {pieces} from './pieces.js'

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

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
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
    var info = "";
    for (let m = 0; m < 8; m++) {
        for (let n = 0; n < 8; n++) {
            if (board[m][n] == null) {
                info += "0,"
            }
            else {
                info += translate(board[m][n].type, board[m][n].color) + ","
            }
        }
    }
    //console.log(info);
    return JSON.stringify(info);
}

function translate(type, color) {
    let c = 0
    if (color == "Black") {
        c = 10
    }
    switch (type) {
        case "pawn":
            return 6 + c
        case "rook":
            return 1 + c
        case "horse":
            return 2 + c
        case "bishop":
            return 3 + c
        case "king":
            return 5 + c
        case "queen":
            return 4 + c
    }
}

function translateFigureReverse(figure) {
    if (figure == null) {
        return 0
    }
    c = 10
    if (figure.color == "White") {
        c = 0
    }
    switch (figure.type) {
        case "pawn":
            return 6 + c
        case "rook":
            return 1 + c
        case "horse":
            return 2 + c
        case "bishop":
            return 3 + c
        case "king":
            return 4 + c
        case "queen":
            return 5 + c
    }
}

function drawBoard(turn) {
    var boardtodraw = "";
    for (let i = 0; i < 9; i++) {
        boardtodraw += "<tr>";
        for (let j = 0; j < 9; j++) {
            if ((i + j + 1) % 2 == 0 && i > 0 && j > 0) {
                boardtodraw += "<td style='background-color:grey' class='sachovnica'>";
            }
            else {
                boardtodraw += "<td class='sachovnica'>";
            }
            if (turn == 0) {
                boardtodraw += "<p id=" + (8 - i) + (j - 1) + " onclick='processClick(this.id)'></td>";
            }
            else {
                boardtodraw += "<p id=" + (i - 1) + (j - 1) + " onclick='processClick(this.id)'></td>";
            }
        }
    }
    boardtodraw += "</tr>";

    document.getElementById("table").innerHTML = boardtodraw;
    if (turn == 0) {
        for (let i = 0; i < 8; i++) {
            document.getElementById("8" + i).innerHTML = String.fromCharCode(97 + i);
            document.getElementById(i + "-1").innerHTML = i + 1;
        }
    }
    else {
        for (let i = 0; i < 8; i++) {
            document.getElementById("-1" + i).innerHTML = String.fromCharCode(97 + i);
            document.getElementById(i + "-1").innerHTML = i + 1;
        }
    }
}

function refresh(board) {
    console.log(board)
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] != null) {
                document.getElementById("" + i + j).innerHTML = board[i][j].bn;
            }
            else document.getElementById("" + i + j).innerHTML = null;
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

export{createArray,initialiseBoard,drawBoard,refresh,boardJson}