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
var turn = 0;
var turns = 1;
var gameover = false;

initialiseBoard();
drawBoard();
refresh();

function change(x, y) {
    console.log("HC"+turn);
    var xs;
    var ys;
    switch (turn) {
        case 0:
            var sel = selectPiece(x, y, board);
            xs = sel[0];
            ys = sel[1];
            turn=sel[2]
            console.log("case 0"+turn)
            break;
        case 1:
            caseh = movePiece(x, y, board);
            console.log("case 1"+turn)
            return caseh;

        case 2:
            var sel = selectPiece(x, y, board);
            xs = sel[0];
            ys = sel[1];
            break;
        case 3:
            caseh = movePiece(x, y, board);
            return caseh;
    }
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}


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

function verMove(x, y, xs, ys, board) {
    if (sign(xs - x) == 0 || sign(ys - y) == 0) {
        return true;
    }
    else {
        return false
    }
}
function diaMove(x, y, xs, ys, board) {
    if (abs(x - xs) == abs(y - ys)) {
        return true;
    }
    else {
        return false
    }
}
function pawn(x, y, xs, ys, board) {
    return true;
 }
function rook(x, y, xs, ys, board) {
    return true; }
function horse(x, y, xs, ys, board) {
    return true; }
function bishop(x, y, xs, ys, board) {
    return true; }
function king(x, y, xs, ys, board) {
    if (abs(xs - x) <= 1 && abs(ys - y) <= 1 && (board[x][y] == null || (board[x][y].color !== board[xs][ys].color))) {
        return true;
    }
    else {
        return false;
    }
}
function queen(x, y, xs, ys, board) { 
    return true;}

function rule(x, y, xs, ys, board) {
    switch (board[xs][ys].type) {
        case "pawn":
            return pawn(x, y, xs, ys, board);
        case "rook":
            return rook(x, y, xs, ys, board);
        case "horse":
            return horse(x, y, xs, ys, board);
        case "bishop":
            return bishop(x, y, xs, ys, board);
        case "king":
            return king(x, y, xs, ys, board);
        case "queen":
            return queen(x, y, xs, ys, board);
    }
    document.getElementById("error").innerHTML = "Unknown Piece";
    return false;
}

function selectPiece(x, y, board, turn) {
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
    if (turn) {
        var color = "Black";
    }
    else {
        var color = "White";
    }

    if (board[x][y] != null && board[x][y].color == color) {
        document.getElementById("error").innerHTML = "&#8203";
        document.getElementById("myButton1").value = color + " Move";
        var xs = x;
        var ys = y;
        if (turn) {
            turn = 3;
        }
        else {
            turn = 1;
        }
        document.getElementById("" + x + y).setAttribute("style", 'font-weight: bold;');
    }
    else {
        document.getElementById("error").innerHTML = "Not Your Piece";
    }
    return ("" + xs + ys + turn)
}
function movePiece(x, y, xs, ys, board) {
    var color = [];
    console.log("Is the board fucked up?");
    //console.log(board[2][1] != null);
    if (turn == 1) {
        color[0] = "White";
        color[1] = "Black";
    }
    else {
        color[0] = "Black";
        color[1] = "White";
    }
    if (rule(x, y, xs, ys, board)) {
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
        if (check(board, color[0])) {
            if (turn == 1) {
                turn = 0;
            }
            else {
                console.log("Case changed "+x+y)
                turn = 2;
            }
            board[moving.x][moving.y] = moving.piece;
            board[moved.xs][moved.ys] = moved.piece;
            document.getElementById("error").innerHTML = "Check";
            additionalInfo = "Check";
            document.getElementById("" + xs + ys).setAttribute("style", 'font-weight: normal;');
            console.log("MovePiece false backmove")
            return false;
        }
        if (turn == 1) {
            console.log("Case changed "+x+y)
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
function processButton() {
    var input = document.getElementById("input").value;
    if (input.length !== 2) { return false; }
    y = input[0].charCodeAt(0) - 97;
    x = input[1] - 1;
    if (x < 0 || y < 0 || x > 7 || y > 7) { return false; }
    change(x, y, 0);
}
function processClick(coordinates) {
    //rozoberanie coordinates
    xc = coordinates.slice(0, 1);
    yc = coordinates.slice(1, 2);
    change(parseInt(xc, 10), parseInt(yc, 10));
    console.log(coordinates);
}
function sign(x) {
    if (x == 0) {
        return 0;
    }
    if (x) {
        return 1;
    }
    else {
        return -1;
    }
}
function abs(x) {
    if (x < 0) {
        return -x;
    }
    else {
        return x;
    }
}


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
function drawBoard() {
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
            boardtodraw += "<p id=" + (i - 1) + (j - 1) + " onclick='processClick(this.id)'></td>";
        }
    }
    boardtodraw += "</tr>";

    document.getElementById("table").innerHTML = boardtodraw;
    if (turn == 0) {
        for (var i = 0; i < 8; i++) {
            document.getElementById("-1" + i).innerHTML = String.fromCharCode(65 + i);
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