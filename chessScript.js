/*Ak chces vlozit vstup pridaj ho funkciou typu
processClick(coordinates) alebo processButton()
(change(x,y))
vsetko by malo fungovat okrem rosady
a nevie zistovat pat
ak to budes chciet skusit na zapasoch bez rosad len hod na zaciatok checkmate() return false;
*/
//Chess pieces
var wr = {
    bn: "&#9814;",
    color: "White",
    type: "rook",
    turn: null
}
var wh = {
    bn: "&#9816;",
    color: "White",
    type: "horse"
}
var wb = {
    bn: "&#9815;",
    color: "White",
    type: "bishop"
}
var wk = {
    bn: "&#9812;",
    color: "White",
    type: "king",
    turn: null
}
var wq = {
    bn: "&#9813;",
    color: "White",
    type: "queen"
}
var wp = {
    bn: "&#9817;",
    color: "White",
    type: "pawn",
    turns: null
}
var br = {
    bn: "&#9820;",
    color: "Black",
    type: "rook",
    turn: null
}
var bh = {
    bn: "&#9822;",
    color: "Black",
    type: "horse"
}
var bb = {
    bn: "&#9821;",
    color: "Black",
    type: "bishop"
}
var bk = {
    bn: "&#9818;",
    color: "Black",
    type: "king",
    turn: null
}
var bq = {
    bn: "&#9819;",
    color: "Black",
    type: "queen"
}
var bp = {
    bn: "&#9823;",
    color: "Black",
    type: "pawn",
    turn: null
}
var board = createArray(8, 8);
var boardBackup = createArray(8, 8);
initialiseBoard();
var jsonBoard = JSON.stringify(board);
var turn = 0;
drawBoard(0);
refresh();
var gameover = false;
var xs;
var ys;
turns = 1;
console.log("Turn " + turns);
var info;
var additionalInfo;
/**
 * Gets input
 * selects piece
 * moves piece (if possible)
 * knows whos move it curently is
 *
 * @param {*} x
 * @param {*} y
 */
var caseh;
function change(x, y, z, p) {
    p=0;
    //console.log("Change " + x + y+z);
    switch (turn) {
        case 0:
            //console.log("Case 0 selected"+x+y)
            var sel = selectPiece(x, y, board, z);
            xs = sel[0];
            ys = sel[1];
            break;
        case 1:
            caseh = movePiece(x, y, board, z, p);
            info += turn;
            return caseh;
        case 2:
            //console.log("Case 2 selected"+x+y)
            var sel = selectPiece(x, y, board, z);
            xs = sel[0];
            ys = sel[1];
            break;
        case 3:
            caseh = movePiece(x, y, board, z, p);
            info += turn;
            return caseh;
    }
}
/**
 *  Array creator
 *
 * @param {*} dimensions of a square array
 * @returns a 2 dimensional array
 */
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}
/**
 *  Refreshes the <table> acording to the board[][]
 *
 */
function refresh() {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j] != null) {
                document.getElementById("" + i + j).innerHTML = board[i][j].bn;
            }
            else document.getElementById("" + i + j).innerHTML = null;
        }
    }
}
/**
 *  Compare freedom to selected move
 *
 * @param {*} freedom
 * @param {*} x
 * @param {*} y
 * @returns
 */
function movable(freedom, x, y, z) {
    i = 0;
    //var log = "Available: ";
    while (i < freedom.length) {
        var a = "" + freedom[i];
        //log = "" + log + String.fromCharCode((a % 10) + 97) + (Math.floor(a / 10) + 1) + ", ";
        i++;
    }
    //log = log + "\n Selected: " + String.fromCharCode(y + 97) + (x + 1);
    if (!z) {
        //console.log(log);
    }
    if (freedom.indexOf("" + x + y) > -1) {
        return true;
    }
    else {
        return false;
    }
}
/**
 * Checks whether you are in check or not
 *
 * @param {*} board
 * @param {*} color
 * @returns
 */
function check(board, color) {
    var kx = -1;
    var ky;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j] != null && board[i][j].type == "king" && board[i][j].color == color) {
                kx = i;
                ky = j;
                break;
            }
        }
        if (kx != -1) {
            break;
        }
    }
    //console.log("King is:" + kx + ky)
    return endangered(kx, ky, board, color);
}
function endangered(kx, ky, board, color) {
    for (k = 0; k < 8; k++) {
        //console.log("Endangered "+k)
        for (l = 0; l < 8; l++) {
            //console.log("Endangered "+k+l)
            if (board[k][l] != null && board[k][l].color != color && rule(kx, ky, k, l, board, 1)) {
                //console.log("Endamgered by" + k + l);
                //console.log("Endamgered by" + board[k][l].color);
                //console.log("Endamgered by" + color);
                return true;
            }
        }
    }
    return false;
}
/**
 *  Checks vertical/horizontal movability
 *  used by rook and queen
 * @param {*} xs
 * @param {*} ys
 * @param {*} board
 * @returns freedom
 */
function verMove(xs, ys, board) {
    var freedom = [];
    i = 1;
    //Move
    while (ys + i <= 7 && board[xs][ys + i] == null) {
        freedom.push("" + (xs) + (ys + i));
        i++;
    }
    //Take out   
    if (ys + i <= 7 && board[xs][ys + i].color != board[xs][ys].color) {
        freedom.push("" + (xs) + (ys + i));
    }
    //Left
    i = 1;
    while (ys - i >= 0 && board[xs][ys - i] == null) {
        freedom.push("" + (xs) + (ys - i));
        i++;
    }
    //Take out
    if (ys - i >= 0 && board[xs][ys - i].color != board[xs][ys].color) {
        freedom.push("" + (xs) + (ys - i));
    }
    //Down
    i = 1;
    while (xs + i <= 7 && board[xs + i][ys] == null) {
        freedom.push("" + (xs + i) + (ys));
        i++;
    }
    //Take out
    if (xs + i <= 7 && board[xs + i][ys].color != board[xs][ys].color) {
        freedom.push("" + (xs + i) + (ys));
    }
    //Up
    i = 1
    while (xs - i >= 0 && board[xs - i][ys] == null) {
        freedom.push("" + (xs - i) + (ys));
        i++;
    }
    //Take out
    if (xs - i >= 0 && board[xs - i][ys].color != board[xs][ys].color) {
        freedom.push("" + (xs - i) + (ys));
    }
    return freedom;
}
/**
 *  Checks diagonal movability
 *  used by bishop and queen
 * @param {*} xs
 * @param {*} ys
 * @param {*} board
 * @returns freedom
 */
function diaMove(xs, ys, board) {
    var freedom = [];
    //RightDown
    i = 1;
    while (xs + i <= 7 && ys + i <= 7 && board[xs + i][ys + i] == null) {
        freedom.push("" + (xs + i) + (ys + i));
        i++;
    }
    if (xs + i <= 7 && ys + i <= 7 && board[xs + i][ys + i].color != board[xs][ys].color) {
        freedom.push("" + (xs + i) + (ys + i));
    }
    //LeftUp
    i = 1;
    while (xs - i >= 0 && ys - i >= 0 && board[xs - i][ys - i] == null) {
        freedom.push("" + (xs - i) + (ys - i));
        i++;
    }
    if (xs - i >= 0 && ys - i >= 0 && board[xs - i][ys - i].color != board[xs][ys].color) {
        freedom.push("" + (xs - i) + (ys - i));
    }
    //RightUp
    i = 1;
    while (xs - i >= 0 && ys + i <= 7 && board[xs - i][ys + i] == null) {
        freedom.push("" + (xs - i) + (ys + i));
        i++;
    }
    if (xs - i >= 0 && ys + i <= 7 && board[xs - i][ys + i].color != board[xs][ys].color) {
        freedom.push("" + (xs - i) + (ys + i));
    }
    //LeftDown
    i = 1;
    while (xs + i <= 7 && ys - i >= 0 && board[xs + i][ys - i] == null) {
        freedom.push("" + (xs + i) + (ys - i));
        i++;
    }
    if (xs + i <= 7 && ys - i >= 0 && board[xs + i][ys - i].color != board[xs][ys].color) {
        freedom.push("" + (xs + i) + (ys - i));
    }
    return freedom;
}
/**
 *  Pawn movability
 *
 * @param {*} x
 * @param {*} y
 * @param {*} xs
 * @param {*} ys
 * @param {*} board
 * @returns boolean
 */
function pawn(x, y, xs, ys, board, z) {
    var d = 1;
    var pas = false;
    //Direction
    if (board[xs][ys].color == "Black") {
        d = -1;
    }
    var freedom = [];
    //Move forward
    //console.log("" + (xs + d) + ys);
    //console.log(0 <= (xs + d) && (xs + d) <= 7);
    if (0 <= (xs + d) && (xs + d) <= 7 && board[xs + d][ys] == null) {
        freedom.push("" + (xs + d) + (ys));
        if (0 <= (xs + 2 * d) && (xs + 2 * d) <= 7 && board[xs + d][ys] == null && board[xs + d * 2][ys] == null && (xs == 3.5 - 2.5 * d)) {
            freedom.push("" + (xs + 2 * d) + (ys));
        }
    }
    //Take out Right
    if (0 <= (xs + d) && (xs + d) <= 7 && board[xs + d][ys + 1] != null) {
        if (board[xs + d][ys + 1].color != board[xs][ys].color) {
            freedom.push("" + (xs + d) + (ys + 1));
        }
    }
    //Take out left
    if (0 <= (xs + d) && (xs + d) <= 7 && board[xs + d][ys - 1] != null) {
        if (board[xs + d][ys - 1].color != board[xs][ys].color) {
            freedom.push("" + (xs + d) + (ys - 1));
        }
    }
    //console.log("abc " + board[xs][ys + 1] +" "+ xs + (ys + 1));
    // en passant right
    if ((xs == 3.5 + 0.5 * d) && board[xs][ys + 1] != null) {
        if (board[xs][ys + 1].color != board[xs][ys].color && board[xs][ys + 1].type == "pawn" && (board[xs][ys + 1].turns == turns || board[xs][ys + 1].turns == (turns - 1))) {
            freedom.push("" + (xs + d) + (ys + 1));
            pas = true;
        }
    }
    // en passant left
    if ((xs == 3.5 + 0.5 * d) && board[xs][ys - 1] != null) {
        if (board[xs][ys - 1].color != board[xs][ys].color && board[xs][ys - 1].type == "pawn" && (board[xs][ys - 1].turns == turns || board[xs][ys - 1].turns == (turns - 1))) {
            freedom.push("" + (xs + d) + (ys - 1));
            pas = true;
        }
    }
    //console.log("Passant possible?" + movable(freedom, x, y, check))
    //console.log("Passant possible?" + freedom + " to " + x + y + "check" + check)

    if (movable(freedom, x, y, z)) {
        //console.log("Turn add pawn: " + board[xs][ys].type + " " + board[x][y])
        // turn adder
        if (z == 0) {
            //console.log("Turn " + turns + " added to pawn" + xs + ys)
            board[xs][ys].turns = turns;
            //console.log("Pawn turn :" + board[xs][ys].turns)
        }
        //MP takout right
        if (x == (xs + d) && y == (ys + 1) && pas) {
            board[xs][ys + 1] = null;
        }
        //MP takout left
        if (x == (xs + d) && y == (ys - 1) && pas) {
            board[xs][ys - 1] = null;
        }
        //console.log("turn :" + board[xs][ys].turns)
        return true;
    }
    else {
        if (z == 2) {
            return freedom
        }
        return false
    }
}
/**
 *  Rook movability
 *
 * @param {*} x
 * @param {*} y
 * @param {*} xs
 * @param {*} ys
 * @param {*} board
 * @returns boolean
 */
function rook(x, y, xs, ys, board, z) {
    if (z == 2) {
        return verMove(xs, ys, board);
    }
    if (movable(verMove(xs, ys, board), x, y, z)) {
        if (z == 0 && board[xs][ys].turns == null) {
            board[xs][ys].turns = turns;
        }
        return true;
    }
    else {
        return false;
    }
}
/**
 * Horse movability
 *
 * @param {*} x
 * @param {*} y
 * @param {*} xs
 * @param {*} ys
 * @param {*} board
 * @returns boolean
 */
function horse(x, y, xs, ys, board, z) {
    var freedom = [];
    if (xs + 2 <= 7 && ys + 1 <= 7) {
        if (board[xs + 2][ys + 1] == null || board[xs + 2][ys + 1] != null && board[xs + 2][ys + 1].color != board[xs][ys].color) {
            freedom.push("" + (xs + 2) + (ys + 1));
        }
    }
    if (xs + 2 <= 7 && ys - 1 >= 0) {
        if (board[xs + 2][ys - 1] == null || board[xs + 2][ys - 1] != null && board[xs + 2][ys - 1].color != board[xs][ys].color) {
            freedom.push("" + (xs + 2) + (ys - 1));
        }
    }
    if (xs - 2 >= 0 && ys + 1 <= 7) {
        if (board[xs - 2][ys + 1] == null || board[xs - 2][ys + 1] != null && board[xs - 2][ys + 1].color != board[xs][ys].color) {
            freedom.push("" + (xs - 2) + (ys + 1));
        }
    }
    if (xs - 2 >= 0 && ys - 1 >= 0) {
        if (board[xs - 2][ys - 1] == null || board[xs - 2][ys - 1] != null && board[xs - 2][ys - 1].color != board[xs][ys].color) {
            freedom.push("" + (xs - 2) + (ys - 1));
        }
    }
    if (xs + 1 <= 7 && ys + 2 <= 7) {
        if (board[xs + 1][ys + 2] == null || board[xs + 1][ys + 2] != null && board[xs + 1][ys + 2].color != board[xs][ys].color) {
            freedom.push("" + (xs + 1) + (ys + 2));
        }
    }
    if (xs + 1 <= 7 && ys - 2 >= 0) {
        if (board[xs + 1][ys - 2] == null || board[xs + 1][ys - 2] != null && board[xs + 1][ys - 2].color != board[xs][ys].color) {
            freedom.push("" + (xs + 1) + (ys - 2));
        }
    }
    if (xs - 1 >= 0 && ys + 2 <= 7) {
        if (board[xs - 1][ys + 2] == null || board[xs - 1][ys + 2] != null && board[xs - 1][ys + 2].color != board[xs][ys].color) {
            freedom.push("" + (xs - 1) + (ys + 2));
        }
    }
    if (xs - 1 >= 0 && ys - 2 >= 0) {
        if (board[xs - 1][ys - 2] == null || board[xs - 1][ys - 2] != null && board[xs - 1][ys - 2].color != board[xs][ys].color) {
            freedom.push("" + (xs - 1) + (ys - 2));
        }
    }
    if (z == 2) {
        return freedom;
    }
    return movable(freedom, x, y, z);
}
/**
 *  Bishop movability
 *
 * @param {*} x
 * @param {*} y
 * @param {*} xs
 * @param {*} ys
 * @param {*} board
 * @returns boolean
 */
function bishop(x, y, xs, ys, board, z) {
    if (z == 2) {
        return diaMove(xs, ys, board);
    }
    return movable(diaMove(xs, ys, board), x, y, z);
}
/**
 * King movability
 * (not concerning itself with check)
 * @param {*} x
 * @param {*} y
 * @param {*} xs
 * @param {*} ys
 * @param {*} board
 * @returns boolean
 */
function king(x, y, xs, ys, board, z) {
    var freedom = [];
    //RightDown
    if ((xs + 1) < 8 && (ys + 1) < 8) {
        if ((board[xs + 1][ys + 1]) == null || (board[xs + 1][ys + 1]) != null && board[xs + 1][ys + 1].color != board[xs][ys].color) {
            freedom.push("" + (xs + 1) + (ys + 1));
        }
    }
    //LeftUp   
    if ((xs - 1) >= 0 && (ys - 1) < 8) {
        if ((board[xs - 1][ys - 1]) == null || (board[xs - 1][ys - 1]) != null && board[xs - 1][ys - 1].color != board[xs][ys].color) {
            freedom.push("" + (xs - 1) + (ys - 1));
        }
    }
    //RightUp   
    if ((xs - 1) >= 0 && (ys + 1) < 8) {
        if ((board[xs - 1][ys + 1]) == null || (board[xs - 1][ys + 1]) != null && board[xs - 1][ys + 1].color != board[xs][ys].color) {
            freedom.push("" + (xs - 1) + (ys + 1));
        }
    }
    //LeftDown    
    if ((xs + 1) < 8 && (ys - 1) >= 0) {
        if ((board[xs + 1][ys - 1]) == null || (board[xs + 1][ys - 1]) != null && board[xs + 1][ys - 1].color != board[xs][ys].color) {
            freedom.push("" + (xs + 1) + (ys - 1));
        }
    }
    //Right
    if (ys + 1 <= 7) {
        if ((board[xs][ys + 1]) == null || (board[xs][ys + 1]) != null && board[xs][ys + 1].color != board[xs][ys].color) {
            freedom.push("" + (xs) + (ys + 1));
        }
    }
    //Left
    if (ys - 1 >= 0) {
        if ((board[xs][ys - 1]) == null || (board[xs][ys - 1]) != null && board[xs][ys - 1].color != board[xs][ys].color) {
            freedom.push("" + (xs) + (ys - 1));
        }
    }
    //Down
    if (xs + 1 <= 7) {
        if ((board[xs + 1][ys]) == null || (board[xs + 1][ys]) != null && board[xs + 1][ys].color != board[xs][ys].color) {
            freedom.push("" + (xs + 1) + (ys));
        }
    }
    //Up
    if (xs - 1 >= 0) {
        if ((board[xs - 1][ys]) == null || (board[xs - 1][ys]) != null && board[xs - 1][ys].color != board[xs][ys].color) {
            freedom.push("" + (xs - 1) + (ys));
        }
    }
    if (z == 2) {
        return freedom;
    }
    //color
    //console.log(z)
    if (z == 0) {
        if (xs == 0) {
            colork = "White"
        }
        else {
            colork = "Black"
        }
    }
    //Kingside
    var ks = false;
    var qs = false;
    if (z == 0 && board[xs][ys].turns == null && !endangered(xs, ys, board, colork) && board[xs][7] != null && board[xs][7].type == "rook" && board[xs][7].turns == null && board[xs][5] == null && board[xs][6] == null && !endangered(xs, 5, board, colork) && !endangered(xs, 6, board, colork)) {
        freedom.push("" + (xs) + (ys + 2));
        ks = true
    }
    //Queenside
    if (z == 0 && board[xs][ys].turns == null && !endangered(xs, ys, board, colork) && board[xs][0] != null && board[xs][0].type == "rook" && board[xs][0].turns == null && board[xs][2] == null && board[xs][1] == null && board[xs][3] == null && !endangered(xs, 2, board, colork) && !endangered(xs, 3, board, colork)) {
        freedom.push("" + (xs) + (ys - 2));
        qs = true
    }


    if (movable(freedom, x, y, z)) {
        //console.log("Turn add king: " + board[xs][ys].type + " " + board[x][y])
        // turn adder
        if (z == 0) {
            //console.log("Turn " + turns + " added to king" + xs + ys)
            board[xs][ys].turns = turns;
            //console.log("King turn :" + board[xs][ys].turns)
        }
        //KS takout right
        if (x == xs && y == (ys + 2) && ks) {
            board[xs][ys + 1] = board[xs][ys + 3];
            board[xs][ys + 3] = null;
        }
        //QS takout left
        if (x == xs && y == (ys - 2) && qs) {
            board[xs][ys - 1] = board[xs][ys - 4];
            board[xs][ys - 4] = null;
        }
        //console.log("turn :" + board[xs][ys].turns)
        return true;
    }
    else {
        if (z == 2) {
            return freedom
        }
        return false
    }
}
/**
 * Queen movability
 *
 * @param {*} x
 * @param {*} y
 * @param {*} xs
 * @param {*} ys
 * @param {*} board
 * @returns boolean
 */
function queen(x, y, xs, ys, board, z) {
    if (z == 2) {
        return diaMove(xs, ys, board).concat(verMove(xs, ys, board));
    }
    return movable(diaMove(xs, ys, board).concat(verMove(xs, ys, board)), x, y, z);
}
/**
 * Checks movability of selected piece
 * Adds very modularity, much readable, not spagetti
 * @param {*} x
 * @param {*} y
 * @param {*} xs
 * @param {*} ys
 * @param {*} board
 * @returns boolean
 */
function rule(x, y, xs, ys, board, z) {
    x = parseInt(x);
    y = parseInt(y);
    xs = parseInt(xs);
    ys = parseInt(ys);
    /*if (!check) {
        //console.log("Piece: " + board[xs][ys].color + " " + board[xs][ys].type + " turn:" + turns + " From " + xs + ys + " to " + x + y);
    }*/
    switch (board[xs][ys].type) {
        case "pawn":
            return pawn(x, y, xs, ys, board, z);
        case "rook":
            return rook(x, y, xs, ys, board, z);
        case "horse":
            return horse(x, y, xs, ys, board, z);
        case "bishop":
            return bishop(x, y, xs, ys, board, z);
        case "king":
            return king(x, y, xs, ys, board, z);
        case "queen":
            return queen(x, y, xs, ys, board, z);
    }
    document.getElementById("error").innerHTML = "Unknown Piece";
}
/**
 *  Processes button input
 *
 * @returns changes board
 */
function processButton() {
    var input = document.getElementById("input").value;
    if (input.length !== 2 && input.length !== 3) { return false; }
    y = input[0].charCodeAt(0) - 97;
    x = input[1] - 1;
    p = 0;
    if (input.length == 3) {
        p = input[2] - 1;
        console.log(p);
    }
    if (x < 0 || y < 0 || x > 7 || y > 7) { return false; }
    change(x, y, 0, p);
}
/**
 *Processes click input
 *
 * @param {*} coordinates
 */
function processClick(coordinates) {
    //rozoberanie coordinates
    xc = parseInt(coordinates.slice(0, 1), 10);
    yc = parseInt(coordinates.slice(1, 2), 10);
    change(xc, yc, 0, 0);
}
/**
 * Initialises board
 *
 */
function initialiseBoard() {
    board[0][0] = board[0][7] = wr;
    board[7][0] = board[7][7] = br;
    board[0][1] = board[0][6] = wh;
    board[7][1] = board[7][6] = bh;
    board[0][2] = board[0][5] = wb;
    board[7][2] = board[7][5] = bb;
    board[0][4] = wk;
    board[0][3] = wq;
    board[7][4] = bk;
    board[7][3] = bq;
    for (i = 0; i < 8; i++) {
        board[1][i] = wp;
        board[6][i] = bp;
    }
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 8; j++) {
            board[i + 2][j] = null;
        }
    }
}
/**
 * Draws HTML board
 *
 */
function drawBoard(turn) {
    var boardtodraw = "";
    for (var i = 0; i < 9; i++) {
        boardtodraw += "<tr>";
        for (var j = 0; j < 9; j++) {
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
        for (var i = 0; i < 8; i++) {
            document.getElementById("8" + i).innerHTML = String.fromCharCode(97 + i);
            document.getElementById(i + "-1").innerHTML = i + 1;
        }
    }
    else {
        for (var i = 0; i < 8; i++) {
            document.getElementById("-1" + i).innerHTML = String.fromCharCode(97 + i);
            document.getElementById(i + "-1").innerHTML = i + 1;
        }
    }
}
/**
 *  Selects and saves piece
 *  (if selectable)
 * @param {*} x
 * @param {*} y
 * @param {*} board
 * @returns xs + ys
 */
function selectPiece(x, y, board, z) {
    //console.log("Piece selected"+x+y)
    if (gameover) {
        document.getElementById("error").innerHTML = "Game over";
        initialiseBoard();
        turn = 0;
        gameover = false;
        drawBoard(0);
        refresh();
        document.getElementById("myButton1").value = "White Select";
        return false;
    }
    var color;
    if (turn == 0) {
        color = "White";
    }
    else {
        color = "Black";
    }
    if (board[x][y] != null && board[x][y].color == color) {
        document.getElementById("error").innerHTML = "&#8203";
        document.getElementById("myButton1").value = color + " Move";
        xs = x;
        ys = y;
        if (turn == 0) {
            turn = 1;
        }
        else {
            turn = 3;
        }
        //console.log("Bold"+x+y+" "+xs+ys)
        if (z == 0) {
            document.getElementById("" + x + y).setAttribute("style", 'font-weight: bold;');
        }
        //console.log("Case = 1 " + x + y);
    }
    else {
        document.getElementById("error").innerHTML = "Not Your Piece";
    }
    return ("" + xs + ys)
}
/**
 *  Moves selected piece
 *  (if movable)
 *
 * @param {*} x
 * @param {*} y
 * @param {*} board
 */
function movePiece(x, y, board, z, p) {
    var color = [];
    //console.log("Is the board fucked up?");
    //console.log(board[2][1] != null);
    if (turn == 1) {
        color[0] = "White";
        color[1] = "Black";
    }
    else {
        color[0] = "Black";
        color[1] = "White";
    }
    if (rule(x, y, xs, ys, board, z)) {
        document.getElementById("myButton1").value = color[1] + " Select";
        document.getElementById("" + xs + ys).setAttribute("style", 'font-weight: normal;');
        jsonBoard = JSON.stringify(board);
        /*if (board[x][y] != null) {
            moved.x = x;
            moved.y = y;
            moved.piece = board[x][y];
        }*/
        var moving = {
            x: x,
            y: y,
            piece: board[x][y],
        }
        var moved = {
            xs: xs,
            ys: ys,
            piece: board[xs][ys],
        }
        board[x][y] = board[xs][ys];
        board[xs][ys] = null;
        //console.log(board[x][y].type == "pawn");
        //console.log(""+x+y)
        //console.log(x == 0 || x == 7);
        //console.log(p);
        if (board[x][y].type == "pawn" && (x == 0 || x == 7)) {
            console.log("Edge" + p)
            if (x == 0) {
                switch (p) {
                    case 0:
                        board[x][y] = bq
                        break;
                    case 1:
                        board[x][y] = br
                        break;
                    case 2:
                        board[x][y] = bb
                        break;
                    case 3:
                        board[x][y] = bh
                        break;
                }
            }
            if (x == 7) {
                switch (p) {
                    case 0:
                        board[x][y] = wq
                        break;
                    case 1:
                        board[x][y] = wr
                        break;
                    case 2:
                        board[x][y] = wb
                        break;
                    case 3:
                        board[x][y] = wh
                        break;
                }
            }
        }

        if (check(board, color[0])) {
            if (turn == 1) {
                turn = 0;
            }
            else {
                //console.log("Case changed "+x+y)
                turn = 2;
            }
            board[moving.x][moving.y] = moving.piece;
            board[moved.xs][moved.ys] = moved.piece;
            document.getElementById("error").innerHTML = "Check";
            additionalInfo = "Check";
            document.getElementById("" + xs + ys).setAttribute("style", 'font-weight: normal;');
            //console.log("MovePiece false backmove")
            return false;
        }
        if (turn == 1) {
            //console.log("Case changed "+x+y)
            turn = 2;
            if (z == 0) {
                console.log("" + (parseInt(xs) + 1) + (parseInt(ys) + 1) + " " + (x + 1) + (y + 1));
            }

        }
        else {
            turn = 0;
            if (z == 0) {
                turns += 1;
                console.log("" + (parseInt(xs) + 1) + (parseInt(ys) + 1) + " " + (x + 1) + (y + 1));
                console.log("Turn " + turns)
            }
        }
        //console.log("Z: " + z)
        var checkStatus = check(board, color[1]);
        //Board saving
        if (z == 0) {
            info += "Board: \n";
            for (i = 0; i < 8; i++) {
                for (j = 0; j < 8; j++) {
                    info += " " + board[i][j];
                    boardBackup[i][j] = board[i][j];
                }
            }
        }
        //Checkmate
        if (z == 0 && checkStatus) {
            if (checkmate(board, color[1])) {
                document.getElementById("error").innerHTML = "Checkmate";
                additionalInfo = "Checkmate";
                gameover = true;
            }
            else {
                document.getElementById("error").innerHTML = "Check";
                var tcolor = "null";
                for (i = 0; i < 8; i++) {
                    for (j = 0; j < 8; j++) {
                        if (board[i][j] != boardBackup[i][j]) {
                            if (board[i][j] != null) {
                                tcolor = board[i][j].color;
                            }
                            board[i][j] = boardBackup[i][j];
                        }
                    }
                }
                if (tcolor == "White") {
                    turn = 0;
                }
                if (tcolor == "Black") {
                    //console.log("Case changed "+x+y)
                    turn = 2;
                }
                //board = boardBackup;
                //drawBoard(turn)
                refresh();
            }

        }
        //Stalemate
        if (z == 0 && !checkStatus) {
            if (checkmate(board, color[1])) {
                document.getElementById("error").innerHTML = "Stalemate";
                additionalInfo = "Stalemate";
                gameover = true;
            }
            else {
                var tcolor = "null";
                for (i = 0; i < 8; i++) {
                    for (j = 0; j < 8; j++) {
                        if (board[i][j] != boardBackup[i][j]) {
                            if (board[i][j] != null) {
                                tcolor = board[i][j].color
                            }
                            board[i][j] = boardBackup[i][j];
                        }
                    }
                }
                if (tcolor == "White") {
                    turn = 0;
                }
                if (tcolor == "Black") {
                    //console.log("Case changed "+x+y)
                    turn = 2;
                }
                //board = boardBackup;
                //drawBoard(turn)
                refresh();
            }

        }
        //drawBoard(turn)
        refresh();

        return true;
    }
    else {
        if (turn == 1) {
            turn = 0;
        }
        else {
            //console.log("Case changed "+x+y)
            turn = 2;
        }
        additionalInfo = "Cant go there";
        document.getElementById("myButton1").value = color[0] + " Select";
        document.getElementById("error").innerHTML = "Cant go there";
        document.getElementById("" + xs + ys).setAttribute("style", 'font-weight: normal;');
        //console.log("MovePiece true? ")
        return true
    }
    document.getElementById("" + xs + ys).setAttribute("style", 'font-weight: normal;');
    jsonBoard = JSON.stringify(board);
}
/**
 *Checks for checkmate
 *
 * @param {*} board
 * @param {*} color
 * @returns boolean
 */
function checkmate(board, color) {
    //king
    var kx = -1;
    var ky;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j] != null && board[i][j].type == "king" && board[i][j].color == color) {
                kx = i;
                ky = j;
                break;
            }
        }
        if (kx != -1) {
            break;
        }
    }
    //freedoms
    var pieces = [];
    var freedoms = [];
    if (color == "White") {
        color = "Black";
    }
    else {
        color = "White";
    }
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (board[i][j] != null && board[i][j].color != color) {
                if (rule(0, 0, i, j, board, 2).length != 0) {
                    pieces.push("" + i + j);
                    freedoms.push(rule(0, 0, i, j, board, 2));
                }
            }
        }
    }
    var mate = true;
    var i = 0;
    while (mate == true && i < pieces.length) {
        for (j = 0; j < freedoms[i].length; j++) {
            //console.log("Piece " + board[pieces[i][0]][pieces[i][1]].type + ": " + i + ", on:" + (pieces[i][0]) + (pieces[i][1]));
            change(pieces[i][0], pieces[i][1], 1);
            if (change(freedoms[i][j][0], freedoms[i][j][1], 1)) {
                //console.log("Final piece " + board[freedoms[i][j][0]][freedoms[i][j][1]].type + ": " + i + ", on:" + (freedoms[i][j][0]) + (freedoms[i][j][1]));
                mate = false;
                break;
            }
        }
        i++
    }
    return mate;
}
/*
  function pieceMove(xc, yc) {
    window.xs = xc;
    window.ys = yc;
    //zabezpečuje že vieš označiť a odoznačiť figúrku
    if ([window.xs, window.ys] != [window.x, window.y]) {
        //console.log('move from: ' + [window.x, window.y] + ' to: ' + [window.xs, window.ys])
        //<--tuto tá funkcia čo pohybuje týpkov s parametrami x,y,xs,ys,board,
        // zatiaľ tu je len dummy funkcia čo vypíše ako by vyzeral ten move do konzoly.
        // TO-DO: ilegálne pohyby treba poriešiť ešte
        // funguje tak že ak sa figúrka posunie na nejaké miesto odoznaci ju na tom mieste kde sa posunula
        // potom neviem ci chceš aby ostala oznacena keď niekto skúsi ilegálny move alebo nie.. whatever
    }
}
 */
/*function coordinates() {
    var input = document.getElementById("input").value;
    if (input.length !== 2) {
        return false;
    }
    x = input[0].charCodeAt(0) - 97;
    y = input[1] - 1;
    if (x < 0 || y < 0 || x > 7 || y > 7) {
        return false;
    }
    return "" + x + y;
}*/
/*
pieceSelected = false;
function pieceSelect(xc, yc) {
    window.x = xc;
    window.y = yc;
*/
function json() {
    info += "Status: " + additionalInfo;
    var infojs = JSON.stringify(info);
}
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}