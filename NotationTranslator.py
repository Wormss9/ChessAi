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
    board[0,0] = board[0,7] = 1     #wr
    board[0, 1] = board[0, 6] = 2   #wh
    board[0,2] = board[0, 5] = 3    #wb
    board[0,3] = 4                  #wk
    board[0,4] = 5                  #wq
    x = 0
    while x < 8:
        board[1,x] = 6              #wp
        board[6,x] = 16             #bp
        x+=1

    board[7, 0] = board[7, 7] = 11  #br
    board[7, 1] = board[7, 6] = 12  #wh
    board[7, 2] = board[7, 5] = 13  #wb
    board[7, 3] = 15                #bq
    board[7, 4] = 14                #bk
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
    # Checkes which color the queen should be and where the queen/queens are
    if turn%2 == 1:
        figs = numpy.where(board == 5)
        figure_number = 5
    else:
        figs = numpy.where(board == 15)
        figure_number = 15
    # In case both starting and ending coordinates are defined, it's pretty straight forward, just with some conversions
    # from chess format into array format
    if from_coord_x != '' and from_coord_y != '':
        board[squareNumber.get(from_coord_x),from_coord_y - 1] = 0
        board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
    # when only x starting coordinate is defined, it is checked which queen has the coresponding x coordinate and then
    # the move is performed, the same applies for the next condition when only the y coordinate is defined
    elif from_coord_x != '' and from_coord_y == '':
        for i in figs:
            if i[0] == squareNumber.get(from_coord_x):
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
                break
    elif from_coord_x == '' and from_coord_y != '':
        for i in figs:
            if i[1] == squareNumber.get(from_coord_y):
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
                break
    # Lastly, when no starting coordinates are defined, the case is much more complex, each piece is checked whether
    # anything is in the way and whether it can move to desired location
    else:
        for i in figs:
            # dis_x and dis_x act like a vector, not only defining distance for which the figure should move
            # but a direction as well, possible values in terms of directions are 1, 0, -1 which we get out of
            # sign() function, acting as a simple mathematical signum. Then over the entirety of the distance (dis)
            # a loop is performed to check whether any pieces are in the way.
            dis_x = i[0] - squareNumber.get(to_coord_x)
            dis_y = i[1] - to_coord_y - 1
            repetitions = dis_x if dis_x>=dis_y else dis_y
            x = i[0]
            y = i[1]
            for k in range(repetitions):
                x = x + sign(dis_x)
                y = y + sign(dis_y)
                if board[x,y] != 0:
                    break
                if (x,y) == (squareNumber.get(to_coord_x), to_coord_y - 1):
                    board[i[0], i[1]] = 0
                    board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number


# There can be no more than one king of one color on board at once so we are not dealing with ambiguity
def kingMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    if turn % 2 == 1:
        figs = numpy.where(board == 4)
        figure_number = 4
    else:
        figs = numpy.where(board == 14)
        figure_number = 14
    for i in figs:
        board[i[0],i[1]] = 0
        board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number



def bishopMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    if turn % 2 == 1:
        figs = numpy.where(board == 3)
        figure_number = 3
    else:
        figs = numpy.where(board == 13)
        figure_number = 13
    if from_coord_x != '' and from_coord_y != '':
        board[squareNumber.get(from_coord_x), from_coord_y - 1] = 0
        board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
    elif from_coord_x != '' and from_coord_y == '':
        for i in figs:
            if i[0] == squareNumber.get(from_coord_x):
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
                break
    elif from_coord_x == '' and from_coord_y != '':
        for i in figs:
            if i[1] == squareNumber.get(from_coord_y):
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
                break
    else:
        for i in figs:
            # dis_x and dis_x act like a vector, not only defining distance for which the figure should move
            # but a direction as well, possible values in terms of directions are 1, 0, -1 which we get out of
            # sign() function, acting as a simple mathematical signum. Then over the entirety of the distance (dis)
            # a loop is performed to check whether any pieces are in the way.
            dis_x = i[0] - squareNumber.get(to_coord_x)
            dis_y = i[1] - to_coord_y - 1
            if sign(dis_x)*sign(dis_y) == 0:
                break
            repetitions = dis_x if dis_x >= dis_y else dis_y
            x = i[0]
            y = i[1]
            for k in range(repetitions):
                x = x + sign(dis_x)
                y = y + sign(dis_y)
                if board[x, y] != 0:
                    break
                if (x, y) == (squareNumber.get(to_coord_x), to_coord_y - 1):
                    board[i[0], i[1]] = 0
                    board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number



def knightMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    if turn % 2 == 1:
        figs = numpy.where(board == 2)
    else:
        figs = numpy.where(board == 12)
    if from_coord_x != '' and from_coord_y != '':
        board[squareNumber.get(from_coord_x), from_coord_y - 1]
        board[squareNumber.get(to_coord_x), to_coord_y - 1]
    elif from_coord_x != '' and from_coord_y == '':
        for i in figs:
            if i[0] == squareNumber.get(from_coord_x):
                board[i[0], i[1]]
                board[squareNumber.get(to_coord_x), to_coord_y - 1]
                break
    elif from_coord_x == '' and from_coord_y != '':
        for i in figs:
            if i[1] == squareNumber.get(from_coord_y):
                board[i[0], i[1]]
                board[squareNumber.get(to_coord_x), to_coord_y - 1]
                break
    else:
        for i in figs:
            if (i[0], i[1]) == (to_coord_x, to_coord_y):


def rookMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    if turn % 2 == 1:
        figs = numpy.where(board == 1)
        figure_number = 1
    else:
        figs = numpy.where(board == 11)
        figure_number = 11
    if from_coord_x != '' and from_coord_y != '':
        board[squareNumber.get(from_coord_x), from_coord_y - 1] = 0
        board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
    elif from_coord_x != '' and from_coord_y == '':
        for i in figs:
            if i[0] == squareNumber.get(from_coord_x):
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
                break
    elif from_coord_x == '' and from_coord_y != '':
        for i in figs:
            if i[1] == squareNumber.get(from_coord_y):
                board[i[0], i[1]] = 0
                board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number
                break
    else:
        for i in figs:
            # dis_x and dis_x act like a vector, not only defining distance for which the figure should move
            # but a direction as well, possible values in terms of directions are 1, 0, -1 which we get out of
            # sign() function, acting as a simple mathematical signum. Then over the entirety of the distance (dis)
            # a loop is performed to check whether any pieces are in the way.
            dis_x = i[0] - squareNumber.get(to_coord_x)
            dis_y = i[1] - to_coord_y - 1
            if sign(dis_x) * sign(dis_y) != 0:
                break
            repetitions = dis_x if dis_x >= dis_y else dis_y
            x = i[0]
            y = i[1]
            for k in range(repetitions):
                x = x + sign(dis_x)
                y = y + sign(dis_y)
                if board[x, y] != 0:
                    break
                if (x, y) == (squareNumber.get(to_coord_x), to_coord_y - 1):
                    board[i[0], i[1]] = 0
                    board[squareNumber.get(to_coord_x), to_coord_y - 1] = figure_number


def pawnMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    if turn % 2 == 1:
        figs = numpy.where(board == 6)
    else:
        figs = numpy.where(board == 16)
    if from_coord_x != '' and from_coord_y != '':
        board[squareNumber.get(from_coord_x), from_coord_y - 1]
        board[squareNumber.get(to_coord_x), to_coord_y - 1]
    elif from_coord_x != '' and from_coord_y == '':
        for i in figs:
            if i[0] == squareNumber.get(from_coord_x):
                board[i[0], i[1]]
                board[squareNumber.get(to_coord_x), to_coord_y - 1]
                break
    elif from_coord_x == '' and from_coord_y != '':
        for i in figs:
            if i[1] == squareNumber.get(from_coord_y):
                board[i[0], i[1]]
                board[squareNumber.get(to_coord_x), to_coord_y - 1]
                break
    else:
        for i in figs:
            if (i[0], i[1]) == (to_coord_x, to_coord_y):


def processMove(move,turn):
    isCheck = False
    isCapture = False
    if move[-1:] == '+':
        isCheck = True
        move = move[:-1]
    if "x" in move:
        isCapture = True
        move.replace('x','')
    x_to = move[-1:]
    y_to = move[-2:-1]
    x_from = move[-3:-2]
    y_from = move[-4:-3]
    if move[:1].isLower():
        pawnMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    if move[:1] == 'Q':
        queenMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    if move[:1] == 'K':
        kingMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    if move[:1] == 'N':
        knightMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    if move[:1] == 'B':
        bishopMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)
    if move[:1] == 'R':
        rookMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn)

# declaring variables
data = ''
move = ''
turn = 0;
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
                    if not j.endswith('.') and not re.match('^.+-.+$',j):
                        moves.append(j)
                if moves!= []:
                    for move in moves:
                        turn+=1
                        processMove(move,turn)

        data = ''
    else:
        data+=i

