import json
import re
import numpy

def sign(param):
    if param > 0:
        return 1
    if param ==0:
        return 0
    else:
        return -1

# necessary functions
def fillBoard():
    board[0,0] = board[7,0] = 1     #wr
    board[1,0] = board[6, 0] = 2    #wh
    board[2,0] = board[5, 0] = 3    #wb
    board[3,0] = 5                  #wk
    board[4,0] = 4                  #wq
    x = 0
    while x < 8:
        board[x,1] = 6              #wp
        board[x,6] = 16             #bp
        x+=1

    board[0, 7] = board[7, 7] = 11  #br
    board[1, 7] = board[6, 7] = 12  #bh
    board[2, 7] = board[5, 7] = 13  #bb
    board[3, 7] = 15                #bk
    board[4, 7] = 14                #bq
# Dictionary translating algebraic notation into "array notation", used mainly as a shorthand
squareNumber = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "e": 4,
    "f": 5,
    "g": 6,
    "h": 7
}

def queenMove(is_capture,from_coord_x,from_coord_y,to_coord_x,to_coord_y,is_check, turn):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figure_number = 5
    else:
        figure_number = 15
    figs = list(numpy.where(board == figure_number))
    figs = list(zip(figs[0], figs[1]))
    # If an x starting coordinate is defined, every piece that has a different starting coordinate than the one defined
    # is poped, same applies for an y starting coordinate
    if from_coord_x != '':
        for i in figs:
            if i[0] != squareNumber.get(from_coord_x):
                figs.remove(i)
    if from_coord_y != '':
        from_coord_y = int(from_coord_y)
        for i in figs:
            if i[1] != from_coord_y-1:
                figs.remove(i)
    for i in figs:
        print(i)
        print(str(squareNumber.get(to_coord_x)) + ', ' + str(to_coord_y - 1))
        # dis_x and dis_x act like a vector, not only defining distance for which the figure should move
        # but a direction as well, possible values in terms of directions are 1, 0, -1 which we get out of
        # sign() function, acting as a simple mathematical signum. Then over the entirety of the distance (dis)
        # a loop is performed to check whether any pieces are in the way.
        dis_x = int(i[0]) - int(squareNumber.get(to_coord_x))
        dis_y = int(i[1]) - int(to_coord_y - 1)
        repetitions = max(dis_x,dis_y)
        x = i[0]
        y = i[1]
        for k in range(repetitions):
            x = x - sign(dis_x)
            y = y - sign(dis_y)
            if (x, y) == (squareNumber.get(to_coord_x), to_coord_y - 1):
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
            if board[x, y] != 0:
                break

# There can be no more than one king of one color on board at once so we are not dealing with ambiguity, therefore
# wherever the king is found, it is moved to a required position, while the legality of move is left unchecked,
# hoping that the pgn notated moves are legal and no mistakes will be introduced, or just an insignificant amount
# not to sway neural network into making illegal moves
def kingMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figs = numpy.where(board == 4)
        figure_number = 4
    else:
        figs = numpy.where(board == 14)
        figure_number = 14
    figs = list(zip(figs[0], figs[1]))
    for i in figs:
        board[i[0],i[1]] = 0
        board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number



def bishopMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figure_number = 3
    else:
        figure_number = 13
    figs = list(numpy.where(board == figure_number))
    figs = list(zip(figs[0], figs[1]))
    if from_coord_x != '':
        from_coord_x = int(from_coord_x)
        for i in figs:
            if i[0] != squareNumber.get(from_coord_x):
                figs.remove(i)
    if from_coord_y != '':
        from_coord_y = int(from_coord_y)
        for i in figs:
            if i[1] != from_coord_y-1:
                figs.remove(i)
    for i in figs:
        # dis_x and dis_x act like a vector, not only defining distance for which the figure should move
        # but a direction as well, possible values in terms of directions are 1, 0, -1 which we get out of
        # sign() function, acting as a simple mathematical signum. Then over the entirety of the distance (dis)
        # a loop is performed to check whether any pieces are in the way. For bishop we additionally require
        # that the difference between horizontal distance and vertical distance to be zero, to ensure the movement
        # is diagonal
        dis_x = int(i[0]) - int(squareNumber.get(to_coord_x))
        dis_y = int(i[1]) - int(to_coord_y - 1)
        repetitions = max(dis_x,dis_y)
        x = i[0]
        y = i[1]
        for k in range(repetitions):
            x = x - sign(dis_x)
            y = y - sign(dis_y)
            if (x, y) == (squareNumber.get(to_coord_x), to_coord_y - 1):
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
                break
            if board[x, y] != 0:
                break


def knightMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figure_number = 2
    else:
        figure_number = 12
    figs = list(numpy.where(board == figure_number))
    figs = list(zip(figs[0], figs[1]))
    if from_coord_x != '':
        for i in figs:
            if i[0] != squareNumber.get(from_coord_x):
                figs.remove(i)
    if from_coord_y != '':
        from_coord_y = int(from_coord_y)
        for i in figs:
            if i[1] != from_coord_y-1:
                figs.remove(i)
    for i in figs:
        if (squareNumber.get(to_coord_x) in (i[0]+1,i[0]-1) and to_coord_y-1 in (i[1]+2,i[1]-2)) or (squareNumber.get(to_coord_x) in (i[1]+1,i[1]-1) and to_coord_y-1 in (i[0]+2,i[0]-2)):
            board[i[0], i[1]] = 0
            board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number


def rookMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figure_number = 1
    else:
        figure_number = 11
    figs = list(numpy.where(board == figure_number))
    figs = list(zip(figs[0], figs[1]))
    if from_coord_x != '':
        for i in figs:
            if i[0] != squareNumber.get(from_coord_x):
                figs.remove(i)
    if from_coord_y != '':
        from_coord_y = int(from_coord_y)
        for i in figs:
            if i[1] != from_coord_y-1:
                figs.remove(i)
    for i in figs:
        # dis_x and dis_x act like a vector, not only defining distance for which the figure should move
        # but a direction as well, possible values in terms of directions are 1, 0, -1 which we get out of
        # sign() function, acting as a simple mathematical signum. Then over the entirety of the distance (dis)
        # a loop is performed to check whether any pieces are in the way. For rook, additional requirement is posed,
        # that the absolute difference between dis_x and dis_y has to be maximum of the values, ensuring one of them
        # is zero
        dis_x = int(i[0]) - int(squareNumber.get(to_coord_x))
        dis_y = int(i[1]) - int(to_coord_y - 1)
        repetitions = max(dis_x,dis_y)
        x = i[0]
        y = i[1]
        for k in range(repetitions):
            x = x - sign(dis_x)
            y = y - sign(dis_y)
            if (x, y) == (squareNumber.get(to_coord_x), to_coord_y - 1):
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
            if board[x, y] != 0:
                break

def pawnMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figs = numpy.where(board == 6)
        step = 1
        figure_number = 6
    else:
        figs = numpy.where(board == 16)
        step = -1
        figure_number = 16
    figs = list(zip(figs[0], figs[1]))
    if not is_capture:
        for i in figs:
            if turn % 2 == 1 and i[1] == 1:
                k = 2
            elif turn % 2 == 0 and i[1] == 6:
                k = 2
            else:
                k = 1
            if i[0] == squareNumber.get(to_coord_x) and to_coord_y - 1 <= step*k + i[1]:
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
    else:
        if from_coord_x != '':
            for i in figs:
                if i[0] != squareNumber.get(from_coord_x):
                    figs.remove(i)
        if from_coord_y != '':
            from_coord_y = int(from_coord_y)
            for i in figs:
                if i[1] != from_coord_y-1:
                    figs.remove(i)
        for i in figs:
            if i[0] - squareNumber.get(to_coord_x) == step and (i[1] - to_coord_y - 1 == 1 or i[1] - to_coord_y - 1 == -1):
                if board[squareNumber.get(to_coord_x), to_coord_y - 1] == 0:
                    board[squareNumber.get(to_coord_x) - step, to_coord_y - 1] = 0
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number


def castling(which):
    if turn%2 == 1:
        side = 0
        row = 0
    else:
        side = 10
        row = 7
    if which == 'O-O':
        print('castle')
        board[3,row] = 0
        board[1,row] = 5 + side
        board[0,row] = 0
        board[2,row] = 1+ side
    elif which == 'O-O-O':
        board[3,row] = 0
        board[5, row] = 5 + side
        board[7, row] = 0
        board[4, row] = 1 + side


def processMove(move,turn):
    print(move)
    isCheck = False
    isCapture = False
    if move[-1:] == '+':
        isCheck = True
        move = move[:-1]
    if "x" in move:
        isCapture = True
        move = move.replace('x','')
    if move[:1] == 'Q':
        move = move.replace('Q','')
        y_to = move[-1:]
        x_to = move[-2:-1]
        if move[-3:-2].isnumeric():
            y_from = move[-3:-2]
            x_from = move[-4:-3]
        else:
            x_from = move[-3:-2]
            y_from = ''
        queenMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    elif move[:1] == 'K':
        move = move.replace('K','')
        y_to = move[-1:]
        x_to = move[-2:-1]
        if move[-3:-2].isnumeric():
            y_from = move[-3:-2]
            x_from = move[-4:-3]
        else:
            x_from = move[-3:-2]
            y_from = ''
        kingMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    elif move[:1] == 'N':
        move = move.replace('N','')
        y_to = move[-1:]
        x_to = move[-2:-1]
        if move[-3:-2].isnumeric():
            y_from = move[-3:-2]
            x_from = move[-4:-3]
        else:
            x_from = move[-3:-2]
            y_from = ''
        knightMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    elif move[:1] == 'B':
        move = move.replace('B','')
        y_to = move[-1:]
        x_to = move[-2:-1]
        if move[-3:-2].isnumeric():
            y_from = move[-3:-2]
            x_from = move[-4:-3]
        else:
            x_from = move[-3:-2]
            y_from = ''
        bishopMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    elif move[:1] == 'R':
        move = move.replace('R','')
        y_to = move[-1:]
        x_to = move[-2:-1]
        if move[-3:-2].isnumeric():
            y_from = move[-3:-2]
            x_from = move[-4:-3]
        else:
            x_from = move[-3:-2]
            y_from = ''
        rookMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    elif move == 'O-O':
        castling(move)
    elif move == 'O-O-O':
        castling(move)
    else:
        y_to = move[-1:]
        x_to = move[-2:-1]
        if move[-3:-2].isnumeric():
            y_from = move[-3:-2]
            x_from = move[-4:-3]
        else:
            x_from = move[-3:-2]
            y_from = ''
        pawnMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    print(board)

# declaring variables
data = ''
move = ''
turn = 0
moves = []

# data structures
board = numpy.zeros((8, 8))
fillBoard()

file = open('MagnusCarlsen.pgn','r')
contents = file.read()

# emptying the .csv file
with open("train-games.csv", "w") as output:
    output.close()

bracketsOpen = False
for i in contents:
    if i == '\n':
        if data != '':
            if 'Carlsen, Magnus' in data:
                print(data[1:6])
            elif '[' not in data:
                for j in data.split():
                    if not j.endswith('.') and (re.match('O-O-?O?',j) or re.match('[A-Z]?[a-z]?[1-9]?x?[a-z][1-9]',j)):
                        moves.append(j)
                if moves!= []:
                    for move in moves:
                        turn+=1
                        print(turn)
                        processMove(move,turn)

        data = ''
    else:
        data+=i

