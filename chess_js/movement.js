function verMove(x, y, board) {
    let freedom = [];
    // Right
    for (let i = 1; i < 8 - y; i++) {
        if (!board[x][y + i]) {
            freedom.push("" + (x) + (y + i))
        } else {
            if (board[x][y + i].color != board[x][y].color) {
                freedom.push("" + (x) + (y + i));
            } else { break }
        }
    }
    // Left
    for (let i = 1; i <= y; i++) {
        if (!board[x][y - i]) {
            freedom.push("" + (x) + (y - i));
        } else {
            if (board[x][y - i].color != board[x][y].color) {
                freedom.push("" + (x) + (y - i));
            } else { break }
        }
    }
    // Up
    for (let i = 1; i <= x; i++) {
        if (!board[x - i][y]) {
            freedom.push("" + (x - i) + (y));
        } else {
            if (board[x - i][y].color != board[x][y].color) {
                freedom.push("" + (x - i) + (y));
            } else { break }
        }
    }
    // Down
    for (let i = 1; i < 8 - x; i++) {
        if (x + i < 8 && !board[x + i][y]) {
            freedom.push("" + (x + i) + (y));
        } else {
            if (x + i <= 7 && board[x + i][y].color != board[x][y].color) {
                freedom.push("" + (x + i) + (y));
            } else { break }
        }
    }
    return freedom;
}
function diaMove(x, y, board) {
    var freedom = [];
    // RightDown
    for (let i = 1; i < 8 - x && i < 8 - y; i++) {
        if (!board[x + i][y + i]) {
            freedom.push("" + (x + i) + (y + i))
        } else {
            if (board[x + i][y + i].color != board[x][y].color) {
                freedom.push("" + (x + i) + (y + i));
            } else { break }
        }
    }
    // LeftUp
    for (let i = 1; i <= x && i <= y; i++) {
        if (!board[x - i][y - i]) {
            freedom.push("" + (x - i) + (y - i));
        } else {
            if (board[x - i][y - i].color != board[x][y].color) {
                freedom.push("" + (x - i) + (y - i));
            } else { break }
        }
    }
    // RightUp
    for (let i = 1; i <= x && i < 8 - y; i++) {
        if (!board[x - i][y + i]) {
            freedom.push("" + (x - i) + (y + i));
        } else {
            if (board[x - i][y + i].color != board[x][y].color) {
                freedom.push("" + (x - i) + (y + i))
            } else { break }
        }
    }
    // LeftDown
    for (let i = 1; i < 8 - x && i <= y; i++) {
        if (!board[x + i][y - i]) {
            freedom.push("" + (x + i) + (y - i));
        } else {
            if (board[x + i][y - i].color != board[x][y].color) {
                freedom.push("" + (x + i) + (y - i))
            } else { break }
        }
    }
    return freedom;
}
function pawn(x, y, xInit, yInit, board, z, turns) {
    var d = 1;
    if (!board[xInit][yInit].color) {
        d = -1;
    }
    var pas = false;
    var freedom = [];
    // Move forward

    if (0 <= (xInit + d) && (xInit + d) <= 7 && !board[xInit + d][yInit]) {
        freedom.push("" + (xInit + d) + (yInit));
        if (0 <= (xInit + 2 * d) && (xInit + 2 * d) <= 7 && !board[xInit + d][yInit] && !board[xInit + d * 2][yInit] && (xInit == 3.5 - 2.5 * d)) {
            freedom.push("" + (xInit + 2 * d) + (yInit));
        }
    }
    // Take out Right
    if (0 <= (xInit + d) && (xInit + d) <= 7 && board[xInit + d][yInit + 1]) {
        if (board[xInit + d][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + d) + (yInit + 1));
        }
    }
    // Take out left
    if (0 <= (xInit + d) && (xInit + d) <= 7 && board[xInit + d][yInit - 1]) {
        if (board[xInit + d][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + d) + (yInit - 1));
        }
    }
    // En passant right
    if ((xInit == 3.5 + 0.5 * d) && board[xInit][yInit + 1]) {
        if (board[xInit][yInit + 1].color != board[xInit][yInit].color && board[xInit][yInit + 1].type == "pawn" && (board[xInit][yInit + 1].turns == turns || board[xInit][yInit + 1].turns == (turns - 1))) {
            freedom.push("" + (xInit + d) + (yInit + 1));
            pas = true;
        }
    }
    // En passant left
    if ((xInit == 3.5 + 0.5 * d) && board[xInit][yInit - 1]) {
        if (board[xInit][yInit - 1].color != board[xInit][yInit].color && board[xInit][yInit - 1].type == "pawn" && (board[xInit][yInit - 1].turns == turns || board[xInit][yInit - 1].turns == (turns - 1))) {
            freedom.push("" + (xInit + d) + (yInit - 1));
            pas = true;
        }
    }

    if (movable(freedom, x, y)) {
        // Turn adder
        if (z == 0) {
            board[xInit][yInit].turns = turns;
        }
        // MP takout right
        if (x == (xInit + d) && y == (yInit + 1) && pas) {
            board[xInit][yInit + 1] = null;
        }
        // MP takout left
        if (x == (xInit + d) && y == (yInit - 1) && pas) {
            board[xInit][yInit - 1] = null;
        }
        return true;
    }
    else {
        if (z == 2) {
            return freedom
        }
        return false
    }
}
function rook(x, y, xInit, yInit, board, z, turns) {
    if (z == 2) {
        return verMove(xInit, yInit, board);
    }
    if (movable(verMove(xInit, yInit, board), x, y)) {
        if (z == 0 && !board[xInit][yInit].turns) {
            board[xInit][yInit].turns = turns;
        }
        return true;
    }
    else {
        return false;
    }
}
function horse(x, y, xInit, yInit, board, z) {
    var freedom = [];
    if (xInit + 2 <= 7 && yInit + 1 <= 7) {
        if (!board[xInit + 2][yInit + 1] || board[xInit + 2][yInit + 1] && board[xInit + 2][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 2) + (yInit + 1));
        }
    }
    if (xInit + 2 <= 7 && yInit - 1 >= 0) {
        if (!board[xInit + 2][yInit - 1] || board[xInit + 2][yInit - 1] && board[xInit + 2][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 2) + (yInit - 1));
        }
    }
    if (xInit - 2 >= 0 && yInit + 1 <= 7) {
        if (!board[xInit - 2][yInit + 1] || board[xInit - 2][yInit + 1] && board[xInit - 2][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 2) + (yInit + 1));
        }
    }
    if (xInit - 2 >= 0 && yInit - 1 >= 0) {
        if (!board[xInit - 2][yInit - 1] || board[xInit - 2][yInit - 1] && board[xInit - 2][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 2) + (yInit - 1));
        }
    }
    if (xInit + 1 <= 7 && yInit + 2 <= 7) {
        if (!board[xInit + 1][yInit + 2] || board[xInit + 1][yInit + 2] && board[xInit + 1][yInit + 2].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit + 2));
        }
    }
    if (xInit + 1 <= 7 && yInit - 2 >= 0) {
        if (!board[xInit + 1][yInit - 2] || board[xInit + 1][yInit - 2] && board[xInit + 1][yInit - 2].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit - 2));
        }
    }
    if (xInit - 1 >= 0 && yInit + 2 <= 7) {
        if (!board[xInit - 1][yInit + 2] || board[xInit - 1][yInit + 2] && board[xInit - 1][yInit + 2].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit + 2));
        }
    }
    if (xInit - 1 >= 0 && yInit - 2 >= 0) {
        if (!board[xInit - 1][yInit - 2] || board[xInit - 1][yInit - 2] && board[xInit - 1][yInit - 2].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit - 2));
        }
    }
    if (z == 2) {
        return freedom;
    }
    return movable(freedom, x, y);
}
function bishop(x, y, xInit, yInit, board, z) {
    if (z == 2) {
        return diaMove(xInit, yInit, board);
    }
    return movable(diaMove(xInit, yInit, board), x, y);
}
function king(x, y, xInit, yInit, board, z, turns) {
    var freedom = [];
    // RightDown
    if ((xInit + 1) < 8 && (yInit + 1) < 8) {
        if ((!board[xInit + 1][yInit + 1]) || (board[xInit + 1][yInit + 1]) && board[xInit + 1][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit + 1));
        }
    }
    // LeftUp   
    if ((xInit - 1) >= 0 && (yInit - 1) < 8) {
        if ((!board[xInit - 1][yInit - 1]) || (board[xInit - 1][yInit - 1]) && board[xInit - 1][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit - 1));
        }
    }
    // RightUp   
    if ((xInit - 1) >= 0 && (yInit + 1) < 8) {
        if ((!board[xInit - 1][yInit + 1]) || (board[xInit - 1][yInit + 1]) && board[xInit - 1][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit + 1));
        }
    }
    // LeftDown    
    if ((xInit + 1) < 8 && (yInit - 1) >= 0) {
        if ((!board[xInit + 1][yInit - 1]) || (board[xInit + 1][yInit - 1]) && board[xInit + 1][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit - 1));
        }
    }
    // Right
    if (yInit + 1 <= 7) {
        if ((!board[xInit][yInit + 1]) || (board[xInit][yInit + 1]) && board[xInit][yInit + 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit) + (yInit + 1));
        }
    }
    // Left
    if (yInit - 1 >= 0) {
        if ((!board[xInit][yInit - 1]) || (board[xInit][yInit - 1]) && board[xInit][yInit - 1].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit) + (yInit - 1));
        }
    }
    // Down
    if (xInit + 1 <= 7) {
        if ((!board[xInit + 1][yInit]) || (board[xInit + 1][yInit]) && board[xInit + 1][yInit].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit + 1) + (yInit));
        }
    }
    // Up
    if (xInit - 1 >= 0) {
        if ((!board[xInit - 1][yInit]) || (board[xInit - 1][yInit]) && board[xInit - 1][yInit].color != board[xInit][yInit].color) {
            freedom.push("" + (xInit - 1) + (yInit));
        }
    }
    if (z == 2) {
        return freedom;
    }
    if (z == 0) {
        colork = xInit == 0
    }
    // Kingside
    var ks = false;
    var qs = false;
    if (z == 0 && !board[xInit][yInit].turns && !endangered(xInit, yInit, board, colork) && board[xInit][7] && board[xInit][7].type == "rook" && !board[xInit][7].turns && !board[xInit][5] && !board[xInit][6] && !endangered(xInit, 5, board, colork) && !endangered(xInit, 6, board, colork)) {
        freedom.push("" + (xInit) + (yInit + 2));
        ks = true
    }
    // Queenside
    if (z == 0 && !board[xInit][yInit].turns && !endangered(xInit, yInit, board, colork) && board[xInit][0] && board[xInit][0].type == "rook" && !board[xInit][0].turns && !board[xInit][2] && !board[xInit][1] && !board[xInit][3] && !endangered(xInit, 2, board, colork) && !endangered(xInit, 3, board, colork)) {
        freedom.push("" + (xInit) + (yInit - 2));
        qs = true
    }


    if (movable(freedom, x, y)) {
        // Turn adder
        if (z == 0) {
            board[xInit][yInit].turns = turns;
        }
        // KS takout right
        if (x == xInit && y == (yInit + 2) && ks) {
            board[xInit][yInit + 1] = board[xInit][yInit + 3];
            board[xInit][yInit + 3] = null;
        }
        // QS takout left
        if (x == xInit && y == (yInit - 2) && qs) {
            board[xInit][yInit - 1] = board[xInit][yInit - 4];
            board[xInit][yInit - 4] = null;
        }
        return true;
    }
    else {
        if (z == 2) {
            return freedom
        }
        return false
    }
}
function queen(x, y, xInit, yInit, board, z) {
    if (z == 2) {
        return diaMove(xInit, yInit, board).concat(verMove(xInit, yInit, board));
    }
    return movable(diaMove(xInit, yInit, board).concat(verMove(xInit, yInit, board)), x, y);
}
function rule(x, y, xs, ys, board, z, turns) {
    x = parseInt(x);
    y = parseInt(y);
    xs = parseInt(xs);
    ys = parseInt(ys);
    switch (board[xs][ys].type) {
        case 6:
            return pawn(x, y, xs, ys, board, z, turns);
        case 1:
            return rook(x, y, xs, ys, board, z, turns);
        case 2:
            return horse(x, y, xs, ys, board, z);
        case 3:
            return bishop(x, y, xs, ys, board, z);
        case 4:
            return queen(x, y, xs, ys, board, z);
        case 5:
            return king(x, y, xs, ys, board, z, turns);
    }
    document.getElementById("error").innerHTML = "Unknown Piece";
}
function movable(freedom, x, y) {
    if (freedom.indexOf("" + x + y) > -1) {
        return true;
    }
    else {
        return false;
    }
}
export { rule }