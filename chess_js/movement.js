function verMove(xInit, yInit, board) {
    let freedom = [];
    //Right
    for (let i = 1; i < 8 - yInit; i++) {
        if (board[xInit][yInit + i] == null) {
            freedom.push("" + (xInit) + (yInit + i))
        } else {
            if (board[xInit][yInit + i].color != board[xInit][yInit].color) {
                freedom.push("" + (xInit) + (yInit + i));
            } else { break }
        }
    }
    //Left
    for (let i = 1; i <= yInit; i++) {
        if (board[xInit][yInit - i] == null) {
            freedom.push("" + (xInit) + (yInit - i));
        } else {
            if (board[xInit][yInit - i].color != board[xInit][yInit].color) {
                freedom.push("" + (xInit) + (yInit - i));
            } else { break }
        }
    }
    //Up
    for (let i = 1; i <= xInit; i++) {
        if (board[xInit - i][yInit] == null) {
            freedom.push("" + (xInit - i) + (yInit));
        } else {
            if (board[xInit - i][yInit].color != board[xInit][yInit].color) {
                freedom.push("" + (xInit - i) + (yInit));
            } else { break }
        }
    }
    //Down
    for (let i = 1; i < 8 - xInit; i++) {
        if (xInit + i < 8 && board[xInit + i][yInit] == null) {
            freedom.push("" + (xInit + i) + (yInit));
        } else {
            if (xInit + i <= 7 && board[xInit + i][yInit].color != board[xInit][yInit].color) {
                freedom.push("" + (xInit + i) + (yInit));
            } else { break }
        }
    }
    return freedom;
}
function diaMove(xInit, yInit, board) {
    var freedom = [];
    //RightDown
    for (let i = 1; i < 8 - xInit && i < 8 - yInit; i++) {
        if (board[xInit + i][yInit + i] == null) {
            freedom.push("" + (xInit + i) + (yInit + i))
        } else {
            if (board[xInit + i][yInit + i].color != board[xInit][yInit].color) {
                freedom.push("" + (xInit + i) + (yInit + i));
            } else { break }
        }
    }
    //LeftUp
    for (let i = 1; i <= xInit && i <= yInit; i++) {
        if (board[xInit - i][yInit - i] == null) {
            freedom.push("" + (xInit - i) + (yInit - i));
        } else {
            if (board[xInit - i][yInit - i].color != board[xInit][yInit].color) {
                freedom.push("" + (xInit - i) + (yInit - i));
            } else { break }
        }
    }
    //RightUp
    for (let i = 1; i <= xInit && i < 8 - yInit; i++) {
        if (board[xInit - i][yInit + i] == null) {
            freedom.push("" + (xInit - i) + (yInit + i));
        } else {
            if (board[xInit - i][yInit + i].color != board[xInit][yInit].color) {
                freedom.push("" + (xInit - i) + (yInit + i))
            } else { break }
        }
    }
    //LeftDown
    for (let i = 1; i < 8 - xInit && i <= yInit; i++) {
        if (board[xInit + i][yInit - i] == null) {
            freedom.push("" + (xInit + i) + (yInit - i));
        } else {
            if (board[xInit + i][yInit - i].color != board[xInit][yInit].color) {
                freedom.push("" + (xInit + i) + (yInit - i))
            } else { break }
        }
    }
    return freedom;
}
/**
 *  Pawn movability
 *
 * @param {*} x
 * @param {*} y
 * @param {*} xInit
 * @param {*} yInit
 * @param {*} board
 * @returns boolean
 */
function pawn(x, y, xInit, yInit, board, z,turns) {
    var d = 1;
    var pas = false;
    //Direction
    if (board[xInit][yInit].color == "Black") {
        d = -1;
    }
    var freedom = [];
    //Move forward
    //console.log("" + (xInit + d) + yInit);
    //console.log(0 <= (xInit + d) && (xInit + d) <= 7);
    if (0 <= (xInit + d) && (xInit + d) <= 7 && board[xInit + d][yInit] == null) {
        freedom.push("" + (xInit + d) + (yInit));
        if (0 <= (xInit + 2 * d) && (xInit + 2 * d) <= 7 && board[xInit + d][yInit] == null && board[xInit + d * 2][yInit] == null && (xInit == 3.5 - 2.5 * d)) {
            freedom.push("" + (xInit + 2 * d) + (yInit));
        }
    }
    //Take out Right
    if (0 <= (xInit + d) && (xInit + d) <= 7 && board[xInit + d][yInit + 1] != null) {
        if (board[xInit + d][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + d) + (yInit + 1));
        }
    }
    //Take out left
    if (0 <= (xInit + d) && (xInit + d) <= 7 && board[xInit + d][yInit - 1] != null) {
        if (board[xInit + d][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + d) + (yInit - 1));
        }
    }
    //console.log("abc " + board[xInit][yInit + 1] +" "+ xInit + (yInit + 1));
    // en passant right
    if ((xInit == 3.5 + 0.5 * d) && board[xInit][yInit + 1] != null) {
        if (board[xInit][yInit + 1].color != board[xInit][yInit].color && board[xInit][yInit + 1].type == "pawn" && (board[xInit][yInit + 1].turns == turns || board[xInit][yInit + 1].turns == (turns - 1))) {
            freedom.push("" + (xInit + d) + (yInit + 1));
            pas = true;
        }
    }
    // en passant left
    if ((xInit == 3.5 + 0.5 * d) && board[xInit][yInit - 1] != null) {
        if (board[xInit][yInit - 1].color != board[xInit][yInit].color && board[xInit][yInit - 1].type == "pawn" && (board[xInit][yInit - 1].turns == turns || board[xInit][yInit - 1].turns == (turns - 1))) {
            freedom.push("" + (xInit + d) + (yInit - 1));
            pas = true;
        }
    }
    //console.log("Passant possible?" + movable(freedom, x, y, check))
    //console.log("Passant possible?" + freedom + " to " + x + y + "check" + check)

    if (movable(freedom, x, y, z)) {
        //console.log("Turn add pawn: " + board[xInit][yInit].type + " " + board[x][y])
        // turn adder
        if (z == 0) {
            //console.log("Turn " + turns + " added to pawn" + xInit + yInit)
            board[xInit][yInit].turns = turns;
            //console.log("Pawn turn :" + board[xInit][yInit].turns)
        }
        //MP takout right
        if (x == (xInit + d) && y == (yInit + 1) && pas) {
            board[xInit][yInit + 1] = null;
        }
        //MP takout left
        if (x == (xInit + d) && y == (yInit - 1) && pas) {
            board[xInit][yInit - 1] = null;
        }
        //console.log("turn :" + board[xInit][yInit].turns)
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
 * @param {*} xInit
 * @param {*} yInit
 * @param {*} board
 * @returns boolean
 */
function rook(x, y, xInit, yInit, board, z,turns) {
    if (z == 2) {
        return verMove(xInit, yInit, board);
    }
    if (movable(verMove(xInit, yInit, board), x, y, z)) {
        if (z == 0 && board[xInit][yInit].turns == null) {
            board[xInit][yInit].turns = turns;
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
 * @param {*} xInit
 * @param {*} yInit
 * @param {*} board
 * @returns boolean
 */
function horse(x, y, xInit, yInit, board, z) {
    var freedom = [];
    if (xInit + 2 <= 7 && yInit + 1 <= 7) {
        if (board[xInit + 2][yInit + 1] == null || board[xInit + 2][yInit + 1] != null && board[xInit + 2][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 2) + (yInit + 1));
        }
    }
    if (xInit + 2 <= 7 && yInit - 1 >= 0) {
        if (board[xInit + 2][yInit - 1] == null || board[xInit + 2][yInit - 1] != null && board[xInit + 2][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 2) + (yInit - 1));
        }
    }
    if (xInit - 2 >= 0 && yInit + 1 <= 7) {
        if (board[xInit - 2][yInit + 1] == null || board[xInit - 2][yInit + 1] != null && board[xInit - 2][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 2) + (yInit + 1));
        }
    }
    if (xInit - 2 >= 0 && yInit - 1 >= 0) {
        if (board[xInit - 2][yInit - 1] == null || board[xInit - 2][yInit - 1] != null && board[xInit - 2][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 2) + (yInit - 1));
        }
    }
    if (xInit + 1 <= 7 && yInit + 2 <= 7) {
        if (board[xInit + 1][yInit + 2] == null || board[xInit + 1][yInit + 2] != null && board[xInit + 1][yInit + 2].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit + 2));
        }
    }
    if (xInit + 1 <= 7 && yInit - 2 >= 0) {
        if (board[xInit + 1][yInit - 2] == null || board[xInit + 1][yInit - 2] != null && board[xInit + 1][yInit - 2].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit - 2));
        }
    }
    if (xInit - 1 >= 0 && yInit + 2 <= 7) {
        if (board[xInit - 1][yInit + 2] == null || board[xInit - 1][yInit + 2] != null && board[xInit - 1][yInit + 2].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit + 2));
        }
    }
    if (xInit - 1 >= 0 && yInit - 2 >= 0) {
        if (board[xInit - 1][yInit - 2] == null || board[xInit - 1][yInit - 2] != null && board[xInit - 1][yInit - 2].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit - 2));
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
 * @param {*} xInit
 * @param {*} yInit
 * @param {*} board
 * @returns boolean
 */
function bishop(x, y, xInit, yInit, board, z) {
    if (z == 2) {
        return diaMove(xInit, yInit, board);
    }
    return movable(diaMove(xInit, yInit, board), x, y, z);
}
/**
 * King movability
 * (not concerning itself with check)
 * @param {*} x
 * @param {*} y
 * @param {*} xInit
 * @param {*} yInit
 * @param {*} board
 * @returns boolean
 */
function king(x, y, xInit, yInit, board, z,turns) {
    var freedom = [];
    //RightDown
    if ((xInit + 1) < 8 && (yInit + 1) < 8) {
        if ((board[xInit + 1][yInit + 1]) == null || (board[xInit + 1][yInit + 1]) != null && board[xInit + 1][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit + 1));
        }
    }
    //LeftUp   
    if ((xInit - 1) >= 0 && (yInit - 1) < 8) {
        if ((board[xInit - 1][yInit - 1]) == null || (board[xInit - 1][yInit - 1]) != null && board[xInit - 1][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit - 1));
        }
    }
    //RightUp   
    if ((xInit - 1) >= 0 && (yInit + 1) < 8) {
        if ((board[xInit - 1][yInit + 1]) == null || (board[xInit - 1][yInit + 1]) != null && board[xInit - 1][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit + 1));
        }
    }
    //LeftDown    
    if ((xInit + 1) < 8 && (yInit - 1) >= 0) {
        if ((board[xInit + 1][yInit - 1]) == null || (board[xInit + 1][yInit - 1]) != null && board[xInit + 1][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit - 1));
        }
    }
    //Right
    if (yInit + 1 <= 7) {
        if ((board[xInit][yInit + 1]) == null || (board[xInit][yInit + 1]) != null && board[xInit][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit) + (yInit + 1));
        }
    }
    //Left
    if (yInit - 1 >= 0) {
        if ((board[xInit][yInit - 1]) == null || (board[xInit][yInit - 1]) != null && board[xInit][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit) + (yInit - 1));
        }
    }
    //Down
    if (xInit + 1 <= 7) {
        if ((board[xInit + 1][yInit]) == null || (board[xInit + 1][yInit]) != null && board[xInit + 1][yInit].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit));
        }
    }
    //Up
    if (xInit - 1 >= 0) {
        if ((board[xInit - 1][yInit]) == null || (board[xInit - 1][yInit]) != null && board[xInit - 1][yInit].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit));
        }
    }
    if (z == 2) {
        return freedom;
    }
    //color
    //console.log(z)
    if (z == 0) {
        if (xInit == 0) {
            colork = "White"
        }
        else {
            colork = "Black"
        }
    }
    //Kingside
    var ks = false;
    var qs = false;
    if (z == 0) {
        //console.log("1: " + ((z == 0) + 0) + ", 2: " + ((board[xInit][yInit].turns == null) + 0) + ", 3: " + ((!endangered(xInit, yInit, board, colork)) + 0) + ", 4: " + ((board[xInit][7] != null) + 0) + ", 5: " + ((board[xInit][7].type == "rook") + 0) + ", 6: " + ((board[xInit][7].turns == null) + 0) + ", 7: " + ((board[xInit][5] == null) + 0) + ", 8: " + ((board[xInit][6] == null) + 0) + ", 9: " + ((!endangered(xInit, 5, board, colork)) + 0) + ", 10: " + ((!endangered(xInit, 6, board, colork)) + 0))
    }
    if (z == 0 && board[xInit][yInit].turns == null && !endangered(xInit, yInit, board, colork) && board[xInit][7] != null && board[xInit][7].type == "rook" && board[xInit][7].turns == null && board[xInit][5] == null && board[xInit][6] == null && !endangered(xInit, 5, board, colork) && !endangered(xInit, 6, board, colork)) {
        freedom.push("" + (xInit) + (yInit + 2));
        ks = true
    }
    //Queenside
    if (z == 0 && board[xInit][yInit].turns == null && !endangered(xInit, yInit, board, colork) && board[xInit][0] != null && board[xInit][0].type == "rook" && board[xInit][0].turns == null && board[xInit][2] == null && board[xInit][1] == null && board[xInit][3] == null && !endangered(xInit, 2, board, colork) && !endangered(xInit, 3, board, colork)) {
        freedom.push("" + (xInit) + (yInit - 2));
        qs = true
    }


    if (movable(freedom, x, y, z)) {
        //console.log("Turn add king: " + board[xInit][yInit].type + " " + board[x][y])
        // turn adder
        if (z == 0) {
            //console.log("Turn " + turns + " added to king" + xInit + yInit)
            board[xInit][yInit].turns = turns;
            //console.log("King turn :" + board[xInit][yInit].turns)
        }
        //KS takout right
        if (x == xInit && y == (yInit + 2) && ks) {
            board[xInit][yInit + 1] = board[xInit][yInit + 3];
            board[xInit][yInit + 3] = null;
        }
        //QS takout left
        if (x == xInit && y == (yInit - 2) && qs) {
            board[xInit][yInit - 1] = board[xInit][yInit - 4];
            board[xInit][yInit - 4] = null;
        }
        //console.log("turn :" + board[xInit][yInit].turns)
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
 * @param {*} xInit
 * @param {*} yInit
 * @param {*} board
 * @returns boolean
 */
function queen(x, y, xInit, yInit, board, z) {
    if (z == 2) {
        return diaMove(xInit, yInit, board).concat(verMove(xInit, yInit, board));
    }
    return movable(diaMove(xInit, yInit, board).concat(verMove(xInit, yInit, board)), x, y, z);
}
function rule(x, y, xs, ys, board, z,turns) {
    x = parseInt(x);
    y = parseInt(y);
    xs = parseInt(xs);
    ys = parseInt(ys);
    /*if (!check) {
        //console.log("Piece: " + board[xs][ys].color + " " + board[xs][ys].type + " turn:" + turns + " From " + xs + ys + " to " + x + y);
    }*/
    switch (board[xs][ys].type) {
        case "pawn":
            return pawn(x, y, xs, ys, board, z,turns);
        case "rook":
            return rook(x, y, xs, ys, board, z,turns);
        case "horse":
            return horse(x, y, xs, ys, board, z);
        case "bishop":
            return bishop(x, y, xs, ys, board, z);
        case "king":
            return king(x, y, xs, ys, board, z,turns);
        case "queen":
            return queen(x, y, xs, ys, board, z);
    }
    document.getElementById("error").innerHTML = "Unknown Piece";
}
function movable(freedom, x, y, z) {
    if (freedom.indexOf("" + x + y) > -1) {
        return true;
    }
    else {
        return false;
    }
}
export { rule }