//Chess pieces
var wr = {
    bn: "&#9814;",
    color: "White",
    type: "rook"
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
    type: "king"
}
var wq = {
    bn: "&#9813;",
    color: "White",
    type: "queen"
}
var wp = {
    bn: "&#9817;",
    color: "White",
    type: "pawn"
}
var br = {
    bn: "&#9820;",
    color: "Black",
    type: "rook"
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
    type: "king"
}
var bq = {
    bn: "&#9819;",
    color: "Black",
    type: "queen"
}
var bp = {
    bn: "&#9823;",
    color: "Black",
    type: "pawn"
}
var board = createArray(8, 8)
initialiseBoard()
var jsonBoard = JSON.stringify(board);
drawBoard()
refresh();

var xs
var ys
turn = 0;
turns = 0;
/**
 * Gets input
 * selects piece
 * moves piece (if possible)
 * knows whos move it curently is
 *
 * @param {*} x
 * @param {*} y
 */
function change(x, y) {
    //console.log("Change " + x + y);
    switch (turn) {
        case 0:
            var sel = selectPiece(x, y, board)
            xs = sel[0];
            ys = sel[1];
            break;
        case 1:
            movePiece(x, y, board)
            break;
        case 2:
            var sel = selectPiece(x, y, board)
            xs = sel[0];
            ys = sel[1];
            break;
        case 3:
            movePiece(x, y, board)
            break;

    }
}

/**
 * Select piece
 *
 */

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
function movable(freedom, x, y, check) {
    i = 0;
    var log = "Available: ";
    while (i < freedom.length) {
        var a = "" + freedom[i];
        log = "" + log + String.fromCharCode((a % 10) + 97) + (Math.floor(a / 10) + 1) + ", ";
        i++;
    }
    log = log + "\n Selected: " + String.fromCharCode(y + 97) + (x + 1);
    if (!check) {
        console.log(log);
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
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (board[i][j] != null && board[i][j].color != color && rule(kx, ky, i, j, board, 1)) {
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
    if (ys - i > 0 && board[xs][ys - i].color != board[xs][ys].color) {
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
function pawn(x, y, xs, ys, board, check) {
    var d = 1;
    if (board[xs][ys].color == "Black") {
        d = -1;
    }
    var freedom = [];
    i = 1;
    while (i <= 2 && board[xs + i * d][ys] == null) {
        freedom.push("" + (xs + i * d) + (ys));
        i++;
    }
    if (board[xs + d][ys + 1] != null) {
        if (board[xs + d][ys + 1].color != board[xs][ys].color) {
            freedom.push("" + (xs + d) + (ys + 1));
        }
    }
    if (board[xs + d][ys - 1] != null) {
        if (board[xs + d][ys - 1].color != board[xs][ys].color) {
            freedom.push("" + (xs + d) + (ys - 1));
        }
    }
    return movable(freedom, x, y, check);
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
function rook(x, y, xs, ys, board, check) {
    return movable(verMove(xs, ys, board), x, y, check);
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
function horse(x, y, xs, ys, board, check) {
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
    return movable(freedom, x, y, check);
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
function bishop(x, y, xs, ys, board, check) {
    return movable(diaMove(xs, ys, board), x, y, check);
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
function king(x, y, xs, ys, board, check) {
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

    return movable(freedom, x, y, check);
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
function queen(x, y, xs, ys, board, check) {
    return movable(diaMove(xs, ys, board).concat(verMove(xs, ys, board)), x, y, check);
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
function rule(x, y, xs, ys, board, check) {
    x = parseInt(x);
    y = parseInt(y);
    xs = parseInt(xs);
    ys = parseInt(ys);
    if (!check) {
        console.log("Piece: " + board[xs][ys].color + " " + board[xs][ys].type + " turn:" + turns);
    }
    switch (board[xs][ys].type) {
        case "pawn":
            return pawn(x, y, xs, ys, board, check);
        case "rook":
            return rook(x, y, xs, ys, board, check);
        case "horse":
            return horse(x, y, xs, ys, board, check);
        case "bishop":
            return bishop(x, y, xs, ys, board, check);
        case "king":
            return king(x, y, xs, ys, board, check);
        case "queen":
            return queen(x, y, xs, ys, board, check);
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
    if (input.length !== 2) { return false; }
    y = input[0].charCodeAt(0) - 97;
    x = input[1] - 1;
    if (x < 0 || y < 0 || x > 7 || y > 7) { return false; }
    change(x, y);
}
/**
 *Processes click input
 *
 * @param {*} coordinates
 */
function processClick(coordinates) {
    //rozoberanie coordinates
    xc = coordinates.slice(0, 1);
    yc = coordinates.slice(1, 2);
    change(parseInt(xc, 10), parseInt(yc, 10));
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
    board[0][3] = wk;
    board[0][4] = wq;
    board[7][3] = bk;
    board[7][4] = bq;
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
function drawBoard() {
    document.write('<table id="table">')
    for (var i = 0; i < 9; i++) {
        document.write("<tr>");
        for (var j = 0; j < 9; j++) {
            if ((i + j + 1) % 2 == 0 && i > 0 && j > 0) {
                document.write("<td style='background-color:grey' class='sachovnica'>");
            }
            else {
                document.write("<td class='sachovnica'>");
            }
            document.write("<p id=" + (i - 1) + (j - 1) + " onclick='processClick(this.id)'></td>");
        }
        document.write("</tr>");
    }
    document.write("</table>");
    for (var i = 0; i < 8; i++) {
        document.getElementById("-1" + i).innerHTML = String.fromCharCode(97 + i);
        document.getElementById(i + "-1").innerHTML = i + 1;
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
function selectPiece(x, y, board) {
    var color;
    if (turn == 0) {
        color = "White"
    }
    else {
        color = "Black"
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
        document.getElementById("" + x + y).setAttribute("style", 'font-weight: bold;');
        console.log("Case = 1 " + x + y);
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
function movePiece(x, y, board) {
    var color = [];
    if (turn == 1) {
        color[0] = "White"
        color[1] = "Black"
    }
    else {
        color[0] = "Black"
        color[1] = "White"
    }
    if (rule(x, y, xs, ys, board, 0)) {

        document.getElementById("myButton1").value = color[1] + " Select";
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
        if (check(board, color[0])) {
            if (turn == 1) {
                turn = 0;
            }
            else {
                turn = 2;
            }
            board[moving.x][moving.y] = moving.piece;
            board[moved.xs][moved.ys] = moved.piece;

            document.getElementById("error").innerHTML = "Check";
        }
        if (turn == 1) {
            turn = 2;
        }
        else {
            turn = 0;
            turns += 1;
        }
        if(check(board, color[1])&& checkmate(board, color[1])){
            document.getElementById("error").innerHTML = "Checkmate";
        }
        refresh();
    }
    else {
        turn = 0;
        document.getElementById("myButton1").value = color[0] + " Select";
        document.getElementById("error").innerHTML = "Cant go there";
    }
    console.log("wat " + xs + ys);
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
function checkmate(board, color){
    return false;
}

/*
  function pieceMove(xc, yc) {
    window.xs = xc;
    window.ys = yc;
    //zabezpečuje že vieš označiť a odoznačiť figúrku
    if ([window.xs, window.ys] != [window.x, window.y]) {
        console.log('move from: ' + [window.x, window.y] + ' to: ' + [window.xs, window.ys])
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
}*/