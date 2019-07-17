document.getElementById("error").innerHTML = "&#8203"
//Array creator
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}
//Chess pieces
var board = createArray(8, 8)
var wr = {
    bn: "&#9814;",
    color: "white",
    type: "rook"
}
var wh = {
    bn: "&#9816;",
    color: "white",
    type: "horse"
}
var wb = {
    bn: "&#9815;",
    color: "white",
    type: "bishop"
}

var wk = {
    bn: "&#9812;",
    color: "white",
    type: "king"
}

var wq = {
    bn: "&#9813;",
    color: "white",
    type: "queen"
}

var wp = {
    bn: "&#9817;",
    color: "white",
    type: "pawn"
}

var br = {
    bn: "&#9820;",
    color: "black",
    type: "rook"
}
var bh = {
    bn: "&#9822;",
    color: "black",
    type: "horse"
}
var bb = {
    bn: "&#9821;",
    color: "black",
    type: "bishop"
}

var bk = {
    bn: "&#9818;",
    color: "black",
    type: "king"
}

var bq = {
    bn: "&#9819;",
    color: "black",
    type: "queen"
}

var bp = {
    bn: "&#9823;",
    color: "black",
    type: "pawn"
}
//Board inicalizaton
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
//Board Drawing
document.write('<table id="table">')
for (var i = 0; i < 9; i++) {
    document.write("<tr>");
    for (var j = 0; j < 9; j++) {
        if ((i + j + 1) % 2 == 0 && i > 0 && j > 0) {
            document.write("<td style='background-color:grey'>");
        }
        else {
            document.write("<td>");
        }
        document.write("<p id=" + (i - 1) + (j - 1) + "></td>");
    }
    document.write("</tr>");
}


//Refresh
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
refresh();
for (var i = 0; i < 8; i++) {
    document.getElementById("-1" + i).innerHTML = String.fromCharCode(97 + i);
    document.getElementById(i + "-1").innerHTML = i + 1;
}
//Input translator
function coordinates() {
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
}
//
//Rules
//
//Compare freedom to selected move
function movable(freedom, x, y) {
    console.log(freedom + "/n" + x + " " + y);
    if (freedom.indexOf("" + x + y) > -1) {
        return true;
    }
    else {
        return false;
    }
}
//Are you in check?
function check(board, color) {
    var kx = -1;
    var ky;
    for (var i = 0; i < 8; i++) {
        for (var j = o; j < 8; j++) {
            if (typeof (board[i][j]) != undefined && board[i][j].type == "king" && board[i][j].color == color) {
                kx = i;
                ky = j;
                break;
            }
        }
        if (kx != -1) {
            break;
        }
    }
    for (i = 0; i < 8; i++) {
        for (j = o; j < 8; j++) {
            if (typeof (board[i][j]) != undefined && board[i][j].color != color && rule(kx, ky, i, j, board)){
                return true;
            }
        }
    }
    return false;
}
//Vertical/Horizontal Movement
function verMove(xs, ys, board) {
    var freedom = [];
    i = 1;
    //Move
    while (typeof (board[xs][ys + i]) == "undefined" && ys + i < 8) {
        freedom.push("" + (xs) + (ys + i));
        i++;
    }
    //Take out
    if (ys + i <= 7 && board[xs][ys + i].color != board[xs][ys].color) {
        freedom.push("" + (xs) + (ys + i));
    }
    //Left
    i = 1;
    while (typeof (board[xs][ys - i]) == "undefined" && ys - i >= 0) {
        freedom.push("" + (xs) + (ys - i));
        i++;
    }
    //Take out
    if (ys - i >= 0 && board[xs][ys - i].color != board[xs][ys].color) {
        freedom.push("" + (xs) + (ys - i));
    }
    //Down
    i = 1;
    while (typeof (board[xs + i][ys]) == "undefined" && xs + i < 8) {
        freedom.push("" + (xs + i) + (ys));
        i++;
    }
    //Take out
    if (xs + i <= 7 && board[xs + i][ys].color != board[xs][ys].color) {
        freedom.push("" + (xs + i) + (ys));
    }
    //Up
    i = 1
    while (typeof (board[xs - i][ys]) == "undefined" && xs - i >= 0) {
        freedom.push("" + (xs - i) + (ys));
        i++;
    }
    //Take out
    if (xs - i >= 0 && board[xs - i][ys].color != board[xs][ys].color) {
        freedom.push("" + (xs - i) + (ys));
    }
    return freedom;
}
//Vertical/Horizontal Movement
function diaMove(xs, ys, board) {
    var freedom = [];
    //RightDown
    i = 1;
    while (typeof (board[xs + i][ys + i]) == "undefined" && ys + i < 8 && xs + i < 8) {
        freedom.push("" + (xs + i) + (ys + i));
        i++;
    }
    if ((xs + i) < 8 && (ys + i) < 8 && board[xs + i][ys + i].color != board[xs][ys].color) {
        freedom.push("" + (xs + i) + (ys + i));
    }
    //LeftUp
    i = 1;
    while (typeof (board[xs - i][ys - i]) == "undefined" && ys - i >= 0 && xs - i >= 0) {
        freedom.push("" + (xs - i) + (ys - i));
        i++;
    }
    if ((xs - i) < 8 && (ys - i) < 8 && board[xs - i][ys - i].color != board[xs][ys].color) {
        freedom.push("" + (xs - i) + (ys - i));
    }
    //RightUp
    i = 1;
    while (typeof (board[xs - i][ys + i]) == "undefined" && ys + i < 8 && xs - i >= 0) {
        freedom.push("" + (xs - i) + (ys + i));
        i++;
    }
    if ((xs - i) >= 0 && (ys + i) < 8 && board[xs - i][ys + i].color != board[xs][ys].color) {
        freedom.push("" + (xs - i) + (ys + i));
    }
    //LeftDown
    i = 1;
    while (typeof (board[xs + i][ys - i]) == "undefined" && ys - i >= 0 && xs + i < 8) {
        freedom.push("" + (xs + i) + (ys - i));
        i++;
    }
    console.log("" + (xs + i) + (ys - i));
    if ((xs + i) < 8 && (ys - i) >= 0 && board[xs + i][ys - i].color != board[xs][ys].color) {
        freedom.push("" + (xs + i) + (ys - i));
    }
    return freedom;
}
//Pawn movement
function pawn(x, y, xs, ys, board) {
    console.log("Pawn" + board[xs][ys].color + " " + turns);
    var d = 1;
    if (board[xs][ys].color == "black") {
        d = -1;
    }
    var freedom = [];
    i = 1;
    while (i <= 2 && typeof (board[xs + i * d][ys]) == "undefined") {
        freedom.push("" + (xs + i * d) + (ys));
        i++;
    }
    if (typeof (board[xs + d][ys + 1]) != "undefined" && board[xs + d][ys + 1].color != board[xs][ys].color) {
        freedom.push("" + (xs + d) + (ys + 1));
    }
    if (typeof (board[xs + d][ys - 1]) != "undefined" && board[xs + d][ys - 1].color != board[xs][ys].color) {
        freedom.push("" + (xs + d) + (ys - 1));
    }

    return movable(freedom, x, y);
}
//Rook movement
function rook(x, y, xs, ys, board) {
    return movable(verMove(xs, ys, board), x, y);
}
//Horse movement
function horse(x, y, xs, ys, board) {
    var freedom = [];
    if (xs + 2 <= 7 && ys + 1 <= 7 && typeof (board[xs + 2][ys + 1]) == "undefined" || typeof (board[xs + 2][ys + 1]) != "undefined" && board[xs + 2][ys + 1].color != board[xs][ys].color) {
        freedom.push("" + (xs + 2) + (ys + 1));
    }
    if (xs + 2 <= 7 && ys - 1 >= 0 && typeof (board[xs + 2][ys - 1]) == "undefined" || typeof (board[xs + 2][ys - 1]) != "undefined" && board[xs + 2][ys - 1].color != board[xs][ys].color) {
        freedom.push("" + (xs + 2) + (ys - 1));
    }
    if (xs - 2 >= 0 && ys + 1 <= 7 && typeof (board[xs - 2][ys + 1]) == "undefined" || typeof (board[xs - 2][ys + 1]) != "undefined" && board[xs - 2][ys + 1].color != board[xs][ys].color) {
        freedom.push("" + (xs - 2) + (ys + 1));
    }
    if (xs - 2 >= 0 && ys - 1 >= 0 && typeof (board[xs - 2][ys - 1]) == "undefined" || typeof (board[xs - 2][ys - 1]) != "undefined" && board[xs - 2][ys - 1].color != board[xs][ys].color) {
        freedom.push("" + (xs - 2) + (ys - 1));
    }
    if (xs + 1 <= 7 && ys + 2 <= 7 && typeof (board[xs + 1][ys + 2]) == "undefined" || typeof (board[xs + 1][ys + 2]) != "undefined" && board[xs + 1][ys + 2].color != board[xs][ys].color) {
        freedom.push("" + (xs + 1) + (ys + 2));
    }
    if (xs + 1 <= 7 && ys - 2 >= 0 && typeof (board[xs + 1][ys - 2]) == "undefined" || typeof (board[xs + 1][ys - 2]) != "undefined" && board[xs + 1][ys - 2].color != board[xs][ys].color) {
        freedom.push("" + (xs + 1) + (ys - 2));
    }
    if (xs - 1 >= 0 && ys + 2 <= 7 && typeof (board[xs - 1][ys + 2]) == "undefined" || typeof (board[xs - 1][ys + 2]) != "undefined" && board[xs - 1][ys + 2].color != board[xs][ys].color) {
        freedom.push("" + (xs - 1) + (ys + 2));
    }
    if (xs - 1 >= 0 && ys - 2 >= 0 && typeof (board[xs - 1][ys - 2]) == "undefined" || typeof (board[xs - 1][ys - 2]) != "undefined" && board[xs - 1][ys - 2].color != board[xs][ys].color) {
        freedom.push("" + (xs - 1) + (ys - 2));
    }
    return movable(freedom, x, y);
}
//Bishop movement
function bishop(x, y, xs, ys, board) {
    return movable(diaMove(xs, ys, board), x, y);
}
//King movement
function king(x, y, xs, ys, board) {
    var freedom = [];
    //RightDown
    if ((xs + 1) < 8 && (ys + 1) < 8 && typeof (board[xs + 1][ys + 1]) == "undefined" || typeof (board[xs + 1][ys + 1]) != "undefined" && board[xs + 1][ys + 1].color != board[xs][ys].color) {
        freedom.push("" + (xs + 1) + (ys + 1));
    }
    //LeftUp   
    if ((xs - 1) < 8 && (ys - 1) < 8 && typeof (board[xs - 1][ys - 1]) == "undefined" || typeof (board[xs - 1][ys - 1]) != "undefined" && board[xs - 1][ys - 1].color != board[xs][ys].color) {
        freedom.push("" + (xs - 1) + (ys - 1));
    }
    //RightUp   
    if ((xs - 1) >= 0 && (ys + 1) < 8 && typeof (board[xs - 1][ys + 1]) == "undefined" || typeof (board[xs - 1][ys + 1]) != "undefined" && board[xs - 1][ys + 1].color != board[xs][ys].color) {
        freedom.push("" + (xs - 1) + (ys + 1));
    }
    //LeftDown    
    if ((xs + 1) < 8 && (ys - 1) >= 0 && typeof (board[xs + 1][ys - 1]) == "undefined" || typeof (board[xs + 1][ys - 1]) != "undefined" && board[xs + 1][ys - 1].color != board[xs][ys].color) {
        freedom.push("" + (xs + 1) + (ys - 1));
    }
    //Right
    if (ys + 1 <= 7 && typeof (board[xs][ys + 1]) == "undefined" || typeof (board[xs][ys + 1]) != "undefined" && board[xs][ys + 1].color != board[xs][ys].color) {
        freedom.push("" + (xs) + (ys + 1));
    }
    //Left
    if (ys - 1 >= 0 && typeof (board[xs][ys - 1]) == "undefined" || typeof (board[xs][ys - 1]) != "undefined" && board[xs][ys - 1].color != board[xs][ys].color) {
        freedom.push("" + (xs) + (ys - 1));
    }
    //Down
    if (xs + 1 <= 7 && typeof (board[xs + 1][ys]) == "undefined" || typeof (board[xs + 1][ys]) != "undefined" && board[xs + 1][ys].color != board[xs][ys].color) {
        freedom.push("" + (xs + 1) + (ys));
    }
    //Up
    if (xs - 1 >= 0 && typeof (board[xs - 1][ys]) == "undefined" || typeof (board[xs - 1][ys]) != "undefined" && board[xs - 1][ys].color != board[xs][ys].color) {
        freedom.push("" + (xs - 1) + (ys));
    }

    return movable(freedom, x, y);
}
//Queen movement
function queen(x, y, xs, ys, board) {
    return movable(diaMove(xs, ys, board).concat(verMove(xs, ys, board)), x, y);
}

//Very modularity, much readable, not spagetti
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
}
//Turn changer + piece mover
var xs
var ys
turn = 0;
turns = 0;
function change() {
    var input = document.getElementById("input").value;
    if (input.length !== 2) { return false; }
    y = input[0].charCodeAt(0) - 97;
    x = input[1] - 1;
    if (x < 0 || y < 0 || x > 7 || y > 7) { return false; }
    var moved={
        x:-1,
        y:-1,
        piece:wp
    }
    var moving={
        x:-1,
        y:-1,
        piece:wp
    }
    switch (turn) {
        case 0:
            if (board[x][y] != undefined && board[x][y].color == "white") {
                document.getElementById("error").innerHTML = "&#8203";
                document.getElementById("myButton1").value = "White Move";
                xs = x;
                ys = y;
                turn = 1;
            }
            else {
                document.getElementById("error").innerHTML = "Not Your Piece";
            }
            break;
        case 1:
            if (rule(x, y, xs, ys, board)) {
                document.getElementById("error").innerHTML = "&#8203";
                document.getElementById("myButton1").value = "Black Select";
                if(typeof (board[x][y]) != undefined){
                    moved.x=x;
                    moved.y=y;
                    moved.piece=board[x][y];
                }
                board[x][y] = board[xs][ys];
                moving.x=xs;
                moving.y=ys;
                moving.piece=board[xs][ys];
                board[xs][ys] = null;
                turn = 2;
                if (check(board, "white")){
                    turn = 0;
                    document.getElementById("myButton1").value = "White Select";
                    document.getElementById("error").innerHTML = "Check";
                }
                refresh();
            }
            else {
                turn = 0;
                document.getElementById("myButton1").value = "White Select";
                document.getElementById("error").innerHTML = "Cant go there";
            }
            break;
        case 2:
            if (board[x][y] != undefined && board[x][y].color == "black") {
                document.getElementById("error").innerHTML = "&#8203";
                document.getElementById("myButton1").value = "Black Move";
                xs = x;
                ys = y;
                turn = 3;
            }
            else {
                document.getElementById("error").innerHTML = "Not Your Piece";
            }
            break;
        case 3:
            if (rule(x, y, xs, ys, board)) {
                document.getElementById("error").innerHTML = " ";
                document.getElementById("myButton1").value = "White Select";
                board[x][y] = board[xs][ys];
                board[xs][ys] = null;
                refresh();
                turn = 0;
                turns += 1;
            }
            else {
                turn = 2;
                document.getElementById("myButton1").value = "Black Select";
                document.getElementById("error").innerHTML = "Cant go there";
            }
            break;

    }

}
