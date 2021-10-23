import {createArray,initialiseBoard,drawBoard,refresh,boardJson} from './utils.js'
import {pieces} from './pieces.js'
import {rule} from './movement.js'

window.processButton=processButton
window.processClick=processClick

//#region Variables
var gameover = false;
//whiteAI = true
//blackAI = false
var jsonBoard; //= JSON.stringify(board);
var turn = 0;
var xs;
var ys;
var info;
var additionalInfo;
var caseh;
var board = createArray(8, 8);
var boardBackup = createArray(8, 8);
var turns = 1;
//#endregion



//#region Initialization
initialiseBoard(board);
drawBoard(0);
refresh(board);
//#endregion

function processButton() {
    const input = document.getElementById("input").value;
    if (input.length !== 2 && input.length !== 3) { return false; }
    let y = input[0].charCodeAt(0) - 97;
    let x = input[1] - 1;
    let p = 0;
    if (input.length == 3) {
        p = input[2] - 1;
        console.log(p);
    }
    if (x < 0 || y < 0 || x > 7 || y > 7) { return false; }
    change(x, y, 0, p);
}

function processClick(coordinates) {
    //rozoberanie coordinates
    xc = parseInt(coordinates.slice(0, 1), 10);
    yc = parseInt(coordinates.slice(1, 2), 10);
    change(xc, yc, 0, 0);
}

function change(x, y, z, p) {
    //p = 0;
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
            if (blackAI) {
                return changeBlack()
            }
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
            if (whiteAI) {
                return changeWhite()
            }
            return caseh;
    }
}

function check(board, color) {
    var kx = -1;
    var ky;
    for (
        let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
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
    for (let k = 0; k < 8; k++) {
        //console.log("Endangered "+k)
        for (let l = 0; l < 8; l++) {
            //console.log("Endangered "+k+l)
            if (board[k][l] != null && board[k][l].color != color && rule(kx, ky, k, l, board, 1,turns)) {
                //console.log("Endamgered by" + k + l);
                //console.log("Endamgered by" + board[k][l].color);
                //console.log("Endamgered by" + color);
                return true;
            }
        }
    }
    return false;
}

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
    if (rule(x, y, xs, ys, board, z,turns)) {
        document.querySelector('#button').value = color[1] + " Select";
        document.getElementById("" + xs + ys).setAttribute("style", 'font-weight: normal;');
        //jsonBoard = JSON.stringify(board);
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
        //#region Transform to queen
        if (board[x][y].type == "pawn" && (x == 0 || x == 7)) {
            if (x == 0) {
                switch (p) {
                    case 0:
                        board[x][y] = pieces.bq
                        break;
                    case 1:
                        board[x][y] = pieces.br
                        break;
                    case 2:
                        board[x][y] = pieces.bb
                        break;
                    case 3:
                        board[x][y] = pieces.bh
                        break;
                }
            }
            if (x == 7) {
                switch (p) {
                    case 0:
                        board[x][y] = pieces.wq
                        break;
                    case 1:
                        board[x][y] = pieces.wr
                        break;
                    case 2:
                        board[x][y] = pieces.wb
                        break;
                    case 3:
                        board[x][y] = pieces.wh
                        break;
                }
            }
            console.log("" + (x + 1) + (y + 1) + " " + board[x][y].type)
        }
        //#endregion

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
                jsonBoard = boardJson(board);
            }

        }
        else {
            turn = 0;
            if (z == 0) {
                turns += 1;
                console.log("" + (parseInt(xs) + 1) + (parseInt(ys) + 1) + " " + (x + 1) + (y + 1));
                jsonBoard = boardJson(board);
                console.log("Turn " + turns)
            }
        }
        //console.log("Z: " + z)
        var checkStatus = check(board, color[1]);
        //Board saving
        if (z == 0) {
            info += "Board: \n";
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
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
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
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
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
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
        document.querySelector('#button').value = color[0] + " Select";
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
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
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
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] != null && board[i][j].color != color) {
                if (rule(0, 0, i, j, board, 2,turns).length != 0) {
                    pieces.push("" + i + j);
                    freedoms.push(rule(0, 0, i, j, board, 2,turns));
                }
            }
        }
    }
    var mate = true;
    var i = 0;
    while (mate == true && i < pieces.length) {
        for (let j = 0; j < freedoms[i].length; j++) {
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

function selectPiece(x, y, board, z) {
    //console.log("Piece selected"+x+y)
    //console.log("Selected: " + x + "" + y)
    if (gameover) {
        document.getElementById("error").innerHTML = "Game over";
        console.log(board);
        initialiseBoard();
        turn = 0;
        gameover = false;
        drawBoard(0);
        refresh();
        document.querySelector('#button').value = "White Select";
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
        document.querySelector('#button').value = color + " Move";
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