import json
import csv
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
def inCheck(args, turn):
    if turn % 2 == 1:
        figure_number = 5
    else:
        figure_number = 15
    # rook, queen, bishop
    aftermove = numpy.copy(board)
    aftermove[args[0], args[1]] = 0
    aftermove[args[2], args[3]] = args[4]
    kings = list(numpy.where(board == figure_number))
    kings = list(zip(kings[0], kings[1]))
    for king in kings:
        if bishopMove(False,'','',backToLetter.get(king[0]),king[1]+1,False,turn+1,aftermove,1) != False:
            return True
        elif queenMove(False,'','',backToLetter.get(king[0]),king[1]+1,False,turn+1,aftermove,1) != False:
            return True
        elif rookMove(False,'','',backToLetter.get(king[0]),king[1]+1,False,turn+1,aftermove,1) != False:
            return True
        else:
            return False


def movePiece(args,turn,magnus):
    if turn%2 == magnus:
        move = [args[0],args[1],args[2],args[3]]
        arr = []
        for i in range(8):
            row = board[:,i].tolist()
            arr.extend(row)
        print(arr)
        with open("training_data/train-boards.csv", "a") as fp:
            wr = csv.writer(fp, dialect='excel')
            wr.writerow(arr)
        with open("training_data/train-moves.csv", "a") as fp:
            wr = csv.writer(fp, dialect='excel')
            wr.writerow(move)
    board[args[0], args[1]] = 0
    board[args[2], args[3]] = args[4]


def fillBoard():
    board = numpy.zeros((8, 8))
    board[0,0] = board[7,0] = 1     #wr
    board[1,0] = board[6, 0] = 2    #wh
    board[2,0] = board[5, 0] = 3    #wb
    board[4,0] = 5                  #wk
    board[3,0] = 4                  #wq
    x = 0
    while x < 8:
        board[x,1] = 6              #wp
        board[x,6] = 16             #bp
        x+=1

    board[0, 7] = board[7, 7] = 11  #br
    board[1, 7] = board[6, 7] = 12  #bh
    board[2, 7] = board[5, 7] = 13  #bb
    board[4, 7] = 15                #bk
    board[3, 7] = 14                #bq
    return board
# Dictionary translating algebraic notation into "array notation", used mainly as a shorthand
pieces = {
    'R': 1,
    'N': 2,
    'B': 3,
    'Q': 4,
}

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
backToLetter = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h'
}

def queenMove(is_capture,from_coord_x,from_coord_y,to_coord_x,to_coord_y,is_check, turn, board,calledby):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figure_number = 4
    else:
        figure_number = 14
    figs = list(numpy.where(board == figure_number))
    figs = list(zip(figs[0], figs[1]))
    # If an x starting coordinate is defined, every piece that has a different starting coordinate than the one defined
    # is poped, same applies for an y starting coordinate
    if from_coord_x != '':
        for i in figs.copy():
            if i[0] != squareNumber.get(from_coord_x):
                figs.remove(i)
    if from_coord_y != '':
        from_coord_y = int(from_coord_y)
        for i in figs.copy():
            if i[1] != from_coord_y-1:
                figs.remove(i)
    for i in figs:
        # dis_x and dis_x act like a vector, not only defining distance for which the figure should move
        # but a direction as well, possible values in terms of directions are 1, 0, -1 which we get out of
        # sign() function, acting as a simple mathematical signum. Then over the entirety of the distance (dis)
        # a loop is performed to check whether any pieces are in the way.
        dis_x = int(i[0]) - int(squareNumber.get(to_coord_x))
        dis_y = int(i[1]) - int(to_coord_y - 1)
        repetitions = max(abs(dis_x),abs(dis_y))
        x = i[0]
        y = i[1]
        for k in range(repetitions):
            x = x - sign(dis_x)
            y = y - sign(dis_y)
            if (x, y) == (squareNumber.get(to_coord_x), to_coord_y - 1):
                candidate = i
                if calledby == 0:
                    if not inCheck((i[0], i[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number), turn):
                        figure = candidate
                else:
                    figure = candidate
            try:
                if board[x, y] != 0:
                    break
            except IndexError:
                break
    try:
        with open('tahy.txt', 'a') as the_file:
            if calledby == 0:
                the_file.write(
                    backToLetter.get(figure[0]) + str(figure[1] + 1) + ' , ' + to_coord_x + str(to_coord_y) + '\n')
        return figure[0], figure[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number
    except UnboundLocalError:
        return False

# There can be no more than one king of one color on board at once so we are not dealing with ambiguity, therefore
# wherever the king is found, it is moved to a required position, while the legality of move is left unchecked,
# hoping that the pgn notated moves are legal and no mistakes will be introduced, or just an insignificant amount
# not to sway neural network into making illegal moves
def kingMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figs = numpy.where(board == 5)
        figure_number = 5
    else:
        figs = numpy.where(board == 15)
        figure_number = 15
    figs = list(zip(figs[0], figs[1]))
    for i in figs.copy():
        with open('tahy.txt', 'a') as the_file:
            the_file.write(backToLetter.get(i[0]) + str(i[1] + 1) + ' , ' + to_coord_x + str(to_coord_y) + '\n')
        return i[0], i[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number



def bishopMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn, board,calledby):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figure_number = 3
    else:
        figure_number = 13
    figs = list(numpy.where(board == figure_number))
    figs = list(zip(figs[0], figs[1]))
    if from_coord_x != '':
        from_coord_x = int(from_coord_x)
        for i in figs.copy():
            if i[0] != squareNumber.get(from_coord_x):
                figs.remove(i)
    if from_coord_y != '':
        from_coord_y = int(from_coord_y)
        for i in figs.copy():
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
        if abs(dis_x) == abs(dis_y):
            repetitions = max(abs(dis_x),abs(dis_y))
            x = i[0]
            y = i[1]
            for k in range(repetitions):
                x = x - sign(dis_x)
                y = y - sign(dis_y)
                if (x, y) == (squareNumber.get(to_coord_x), to_coord_y - 1):
                    candidate = i
                    if calledby == 0:
                        if not inCheck((i[0], i[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number), turn):
                            figure = candidate
                    else:
                        figure = candidate
                try:
                    if board[x, y] != 0:
                        break
                except IndexError:
                    break
    try:
        with open('tahy.txt', 'a') as the_file:
            if calledby == 0:
                the_file.write(
                    backToLetter.get(figure[0]) + str(figure[1] + 1) + ' , ' + to_coord_x + str(to_coord_y) + '\n')
            return figure[0], figure[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number
    except UnboundLocalError:
        return False

def knightMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn,calledby):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figure_number = 2
    else:
        figure_number = 12
    figs = list(numpy.where(board == figure_number))
    figs = list(zip(figs[0], figs[1]))
    if from_coord_x != '':
        for i in figs.copy():
            if i[0] != squareNumber.get(from_coord_x):
                figs.remove(i)
    if from_coord_y != '':
        from_coord_y = int(from_coord_y)
        for i in figs.copy():
            if i[1] != from_coord_y-1:
                figs.remove(i)
    for i in figs:
        if (squareNumber.get(to_coord_x) in (i[0]+1,i[0]-1) and to_coord_y-1 in (i[1]+2,i[1]-2)) or (squareNumber.get(to_coord_x) in (i[0]+2,i[0]-2) and to_coord_y-1 in (i[1]+1,i[1]-1)):
            candidate = i
            if calledby == 0:
                if not inCheck((i[0], i[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number), turn):
                    figure = candidate
            else:
                figure = candidate
            try:
                with open('tahy.txt', 'a') as the_file:
                    if calledby == 0:
                        the_file.write(
                            backToLetter.get(figure[0]) + str(figure[1] + 1) + ' , ' + to_coord_x + str(to_coord_y) + '\n')
                return figure[0], figure[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number
            except UnboundLocalError:
                continue


def rookMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn, board, calledby):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figure_number = 1
    else:
        figure_number = 11
    figs = list(numpy.where(board == figure_number))
    figs = list(zip(figs[0], figs[1]))
    if from_coord_x != '':
        for i in figs.copy():
            if i[0] != squareNumber.get(from_coord_x):
                figs.remove(i)
    if from_coord_y != '':
        from_coord_y = int(from_coord_y)
        for i in figs.copy():
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
        if 0 in (dis_x,dis_y):
            repetitions = max(abs(dis_x),abs(dis_y))
            x = i[0]
            y = i[1]
            for k in range(repetitions):
                x = x - sign(dis_x)
                y = y - sign(dis_y)
                if (x, y) == (squareNumber.get(to_coord_x), to_coord_y - 1):
                    candidate = i
                    if calledby == 0:
                        if not inCheck((i[0], i[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number), turn):
                            figure = candidate
                    else:
                        figure = candidate
                try:
                    if board[x, y] != 0:
                        break
                except IndexError:
                    break
    try:
        with open('tahy.txt', 'a') as the_file:
            if calledby == 0:
                the_file.write(
                    backToLetter.get(figure[0]) + str(figure[1] + 1) + ' , ' + to_coord_x + str(to_coord_y) + '\n')
        return figure[0], figure[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number
    except UnboundLocalError:
        return False


def pawnMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check, turn, promotion, calledby):
    to_coord_y = int(to_coord_y)
    if turn % 2 == 1:
        figs = numpy.where(board == 6)
        step = 1
        figure_number = 6
        l = 0
    else:
        figs = numpy.where(board == 16)
        step = -1
        figure_number = 16
        l = 10
    figs = list(zip(figs[0], figs[1]))
    if not is_capture:
        for i in figs:
            if turn % 2 == 1 and i[1] == 1:
                k = 2
            elif turn % 2 == 0 and i[1] == 6:
                k = 2
            else:
                k = 1
            if i[0] == squareNumber.get(to_coord_x) and ((step * k >= to_coord_y - 1 - i[1] > 0 and step == 1) or (step * k <= to_coord_y - 1 - i[1] < 0 and step == -1)):
                onHeadStep = False
                for j in range(abs(to_coord_y - 1 - i[1])):
                    if board[i[0],i[1]+(j+1)*step] != 0:
                        onHeadStep = True
                if not onHeadStep:
                    if int(promotion) == 0:
                        candidate = i
                        if calledby == 0:
                            if not inCheck((i[0], i[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number),
                                           turn):
                                figure = candidate
                        else:
                            figure = candidate
                        try:
                            with open('tahy.txt', 'a') as the_file:
                                if calledby == 0:
                                    the_file.write(
                                        backToLetter.get(figure[0]) + str(figure[1] + 1) + ' , ' + to_coord_x + str(
                                            to_coord_y) + '\n')
                            return figure[0], figure[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number
                        except UnboundLocalError:
                            continue
                    else:
                        candidate = i
                        if calledby == 0:
                            if not inCheck((i[0], i[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number),
                                           turn):
                                figure = candidate
                        else:
                            figure = candidate
                        try:
                            with open('tahy.txt', 'a') as the_file:
                                if calledby == 0:
                                    the_file.write(
                                        backToLetter.get(figure[0]) + str(figure[1] + 1) + ' , ' + to_coord_x + str(
                                            to_coord_y) + ' , ' + str(promotion + l) + '\n')
                            return figure[0], figure[1], squareNumber.get(to_coord_x), to_coord_y - 1, promotion + l
                        except UnboundLocalError:
                            continue
    else:
        if from_coord_x != '':
            for i in figs.copy():
                if i[0] != squareNumber.get(from_coord_x):
                    figs.remove(i)
        if from_coord_y != '':
            from_coord_y = int(from_coord_y)
            for i in figs.copy():
                if i[1] != from_coord_y-1:
                    figs.remove(i)
        for i in figs:
            if to_coord_y - 1 - i[1] == step and (squareNumber.get(to_coord_x) - i[0] == 1 or squareNumber.get(to_coord_x) - i[0] == -1):
                candidate = i
                if calledby == 0:
                    if not inCheck((i[0], i[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number),
                                   turn):
                        figure = candidate
                else:
                    figure = candidate

                if int(promotion) == 0:
                    try:
                        with open('tahy.txt', 'a') as the_file:
                            if calledby == 0:
                                the_file.write(
                                    backToLetter.get(figure[0]) + str(figure[1] + 1) + ' , ' + to_coord_x + str(
                                        to_coord_y) + '\n')
                        if board[squareNumber.get(to_coord_x), to_coord_y - 1] == 0:
                            board[squareNumber.get(to_coord_x), to_coord_y - 1 - step] = 0
                        return figure[0], figure[1], squareNumber.get(to_coord_x), to_coord_y - 1, figure_number
                    except UnboundLocalError:
                        return False
                else:
                    try:
                        with open('tahy.txt', 'a') as the_file:
                            if calledby == 0:
                                the_file.write(
                                    backToLetter.get(figure[0]) + str(figure[1] + 1) + ' , ' + to_coord_x + str(
                                        to_coord_y) + ' , ' +str(promotion+l)+'\n')
                        return i[0], i[1], squareNumber.get(to_coord_x), to_coord_y - 1, promotion + l
                    except UnboundLocalError:
                        return False
def castling(which):
    if turn%2 == 1:
        side = 0
        row = 0
    else:
        side = 10
        row = 7
    if which == 'O-O':
        with open('tahy.txt', 'a') as the_file:
            the_file.write('e'+str(row+1)+' , g'+str(row+1)+'\n')
        board[4,row] = 0
        board[6,row] = 5 + side
        board[7,row] = 0
        board[5,row] = 1+ side
    elif which == 'O-O-O':
        with open('tahy.txt', 'a') as the_file:
            the_file.write('e'+str(row+1)+' , c'+str(row+1)+'\n')
        board[4,row] = 0
        board[2, row] = 5 + side
        board[0, row] = 0
        board[3, row] = 1 + side


def processMove(move,turn,magnus):
    isCheck = False
    isCapture = False
    promotion = 0
    if move[-1:] == '+':
        isCheck = True
        move = move[:-1]
    if "x" in move:
        isCapture = True
        move = move.replace('x','')
    if "#" in move:
        move = move.replace('#','')
    if "=" in move:
        promotion = pieces.get(move[-1:])
        move = move[:-1]
        move = move.replace('=','')
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
        movePiece(queenMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn, board,0),turn,magnus)
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
        movePiece(kingMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn),turn,magnus)
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
        movePiece(knightMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn,0),turn,magnus)
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
        movePiece(bishopMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn, board,0),turn,magnus)
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
        movePiece(rookMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn, board, 0),turn,magnus)
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
        movePiece(pawnMove(isCapture, x_from, y_from, x_to, y_to, isCheck, turn, promotion,0),turn,magnus)

# declaring variables
data = ''
move = ''
turn = 0
moves = []

file = open('MagnusCarlsen.pgn','r')
contents = file.read()

'''
# emptying the .csv file
with open("training_data/train-boards.csv", "w") as fp:
    fp.close()

with open("training_data/train-moves.csv", "w") as fp:
    fp.close()

with open('tahy.txt', 'w') as fp:
    fp.close()
'''
magnus = 0
bracketsOpen = False
for i in contents:
    if i == '\n':
        if data != '':
            if '[' not in data:
                board = fillBoard()
                turn = 0
                for j in data.split():
                    if not j.endswith('.') and (re.match('O-O-?O?',j) or re.match('[A-Z]?[a-z]?[1-9]?x?[a-z][1-9]',j)):
                        moves.append(j)
                if moves!= []:
                    for move in moves:
                        turn+=1
                        print(turn)
                        with open('tahy.txt', 'a') as the_file:
                            the_file.write(str(turn) +'. move: ' + move + '\n')
                        processMove(move,turn,magnus)
                        #if turn == 14:
                        #    exit()
                moves.clear()
                with open('tahy.txt', 'a') as the_file:
                    the_file.write('...\n')
        data = ''
    else:
        data+=i

