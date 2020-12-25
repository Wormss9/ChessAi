import csv
import itertools
import re
import numpy
from typing import List
import _thread
from pandas import *
import time

start_time = time.time()


class Game:
    magnus_white: bool
    result: str
    moves: List[str]

    def set_magnus_white(self, magnus_white):
        self.magnus_white = magnus_white

    def set_result(self, result):
        self.result = result

    def set_moves(self, moves):
        self.moves = moves

    def __repr__(self):
        return str(self.__dict__)


def find_direction(white):
    return (1, 0) if white else (-1, 7)


def sign(param):
    if param > 0:
        return 1
    if param == 0:
        return 0
    else:
        return -1


def create_board():
    board = numpy.zeros((8, 8))
    board[0, 0] = board[7, 0] = 1  # wr
    board[1, 0] = board[6, 0] = 2  # wh
    board[2, 0] = board[5, 0] = 3  # wb
    board[3, 0] = 4  # wk
    board[4, 0] = 5  # wq
    x = 0
    while x < 8:
        board[x, 1] = 6  # wp
        board[x, 6] = -6  # bp
        x += 1

    board[0, 7] = board[7, 7] = -1  # br
    board[1, 7] = board[6, 7] = -2  # bh
    board[2, 7] = board[5, 7] = -3  # bb
    board[4, 7] = -5  # bk
    board[3, 7] = -4  # bq
    return board


# Dictionary translating algebraic notation into "array notation"

square_number = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "e": 4,
    "f": 5,
    "g": 6,
    "h": 7
}

back_to_letter = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h'
}

pieces = {
    'R': 1,
    'N': 2,
    'B': 3,
    'Q': 4,
    'K': 5
}


def translate_piece(value):
    return pieces.get(value)


def square_letter_to_num(letter):
    return square_number.get(letter.lower())


def move_piece(src_x: int, src_y: int, x: int, y: int, value: int, direction: int, in_board: numpy.ndarray,
               turn_into: int = None):
    in_board[src_x, src_y] = 0
    in_board[x, y] = value if not turn_into else turn_into * direction
    return in_board


def pawn_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = direction * 6
    pawn_pos: list = numpy.argwhere(in_board == value).tolist()
    result_list = []
    for i, j in pawn_pos.copy():
        if (src_x is not None and i != src_x) or (src_y is not None and j != src_y):
            pawn_pos.remove([i, j])
    for i, j in pawn_pos:
        #needs a major rewrite, hotfixes piling up now
        if capture and y == j + direction and x in [i + 1, i - 1] and \
                ((in_board[x, y] != 0 and sign(in_board[x,y]) == direction*-1) or
                 (in_board[x,y-direction] != 0 and sign(in_board[x,y-direction]) == direction*-1)):
            if in_board[x, y - direction] != 0 and sign(in_board[x,y-direction]) == direction*-1:
                result_list.append((x, y-direction, 0))
            result_list.append((i, j))
        elif j == starting_end + direction and \
                x - i == 0 and \
                y - j == 2 * direction and \
                in_board[x, y] == 0 and \
                in_board[i,j+direction] == 0:
            result_list.append((i, j))
        elif x - i == 0 and y - j == direction and in_board[x, y] == 0:
            result_list.append((i, j))
    return result_list.copy()


def queen_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = direction * 4
    return generic_all_directions_move(src_x, src_y, x, y, in_board, value)


def bishop_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = direction * 3
    result_list = []
    for i, j in generic_all_directions_move(src_x, src_y, x, y, in_board, value):
        if abs(i - x) == abs(j - y):
            result_list.append((i, j))
    return result_list


def rook_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = direction
    result_list = []
    for i, j in generic_all_directions_move(src_x, src_y, x, y, in_board, value):
        if i - x == 0 or j - y == 0:
            result_list.append((i, j))
    return result_list


def king_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = 5 * direction
    result_list = []
    for i, j in generic_all_directions_move(src_x, src_y, x, y, in_board, value):
        if abs(i - x) == 1 or abs(j - y) == 1:
            result_list.append((i, j))
    return result_list


def knight_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = 2 * direction
    piece_pos = numpy.argwhere(in_board == value).tolist()
    result_list = []
    for i, j in piece_pos.copy():
        if (src_x is not None and i != src_x) or (src_y is not None and j != src_y):
            piece_pos.remove([i, j])
    for i, j in piece_pos:
        if (abs(x - i) == 1 and abs(y - j) == 2) or (abs(x - i) == 2 and abs(y - j) == 1):
            result_list.append((i, j))
    return result_list


def generic_all_directions_move(src_x: int, src_y: int, x: int, y: int, in_board: numpy.ndarray, value: int):
    piece_pos = numpy.argwhere(in_board == value).tolist()
    result_list = []
    for i, j in piece_pos.copy():
        if (src_x is not None and i != src_x) or (src_y is not None and j != src_y):
            piece_pos.remove([i, j])
    for i, j in piece_pos.copy():
        append = True
        if i - x == 0 or j - y == 0 or abs(i - x) == abs(j - y):
            start_x = i
            start_y = j
            if sign(in_board[x, y]) != 0 and sign(in_board[x, y]) == sign(value):
                append = False
            direction_x = sign(x - i)
            direction_y = sign(y - j)
            for i,j in zip(range(i+direction_x,x,direction_x) if direction_x!=0 else itertools.repeat(i),
                           range(j+direction_y,y,direction_y) if direction_y != 0 else itertools.repeat(j)):
                if in_board[i, j] != 0:
                    append = False
            if append:
                result_list.append((start_x, start_y))
    return result_list


def castling(in_board: numpy.ndarray, white: bool, king_side: bool):
    direction, starting_end = find_direction(white)
    if king_side:
        if in_board[4, starting_end] == 5 * direction and in_board[7, starting_end] == direction:
            return [(4, starting_end, 6, starting_end, 5 * direction, direction, in_board),
                    (7, starting_end, 5, starting_end, direction, direction, in_board)]
    else:
        if in_board[4, starting_end] == 5 * direction and in_board[0, starting_end]:
            return [(4, starting_end, 2, starting_end, 5 * direction, direction, in_board),
                    (0, starting_end, 3, starting_end, direction, direction, in_board)]
    return Exception()


def parse_games_in_file(filepath: str):
    game = Game()
    games = []
    file = open(filepath)
    line = file.readline()
    metadata = True
    moves = []
    while line:
        line = line.replace('\n', '')
        if '[' in line and ']' in line and metadata:
            if 'Carlsen' in line:
                if 'WHITE' in line.upper():
                    game.set_magnus_white(True)
                else:
                    game.set_magnus_white(False)
        if line == '':
            metadata = not metadata
            if metadata:
                game.set_moves(moves[:-1].copy())
                games.append(game)
                moves.clear()
                game = Game()
        if not metadata:
            split_line = line.split()
            for i in split_line:
                if '.' in i:
                    moves.append(i.split('.')[1])
                else:
                    moves.append(i)
            if split_line != []:
                game.set_result(split_line[-1])
        line = file.readline()
    return games


def translate_move(move_to_translate: str, white: bool, in_board: numpy.ndarray):
    piece_num = 6
    direction, starting_side = find_direction(white)
    turn_into = None
    if move_to_translate[-1] == '+':
        checking = True
        move_to_translate = move_to_translate[: -1]
    if move_to_translate.replace(' ', '') == 'O-O':
        return castling(in_board, white, True)
    elif move_to_translate.replace(' ', '') == 'O-O-O':
        return castling(in_board, white, False)
        pass
    else:
        if move_to_translate[0].isupper():
            piece_num = translate_piece(move_to_translate[0])
            move_to_translate = move_to_translate[1:]
        piece_num = piece_num if white else piece_num * -1
        src_x = None
        src_y = None
        if move_to_translate[-1] in ['Q', 'R', 'N', 'B']:
            turn_into = translate_piece(move_to_translate[-1])
            move_to_translate = move_to_translate[: -2]
        x = square_letter_to_num(move_to_translate[-2])
        y = int(move_to_translate[-1]) - 1
        capture = False
        move_to_translate = move_to_translate[:-2]
        for i in move_to_translate:
            if i.isdigit():
                src_y = int(i) - 1
            elif i == 'x':
                capture = True
            else:
                src_x = square_letter_to_num(i)
        if abs(piece_num) == 1:
            pieces = rook_move(src_x, src_y, x, y, capture, white, in_board)
        elif abs(piece_num) == 2:
            pieces = knight_move(src_x, src_y, x, y, capture, white, in_board)
        elif abs(piece_num) == 3:
            pieces = bishop_move(src_x, src_y, x, y, capture, white, in_board)
        elif abs(piece_num) == 4:
            pieces = queen_move(src_x, src_y, x, y, capture, white, in_board)
        elif abs(piece_num) == 5:
            pieces = king_move(src_x, src_y, x, y, capture, white, in_board)
        elif abs(piece_num) == 6:
            pieces = pawn_move(src_x, src_y, x, y, capture, white, in_board)
            if len(pieces) == 2:
                return [(pieces[0][0], pieces[0][1], x, y, piece_num, direction, in_board, turn_into),
                        (pieces[1][0], pieces[1][1], x, y, 0, direction, in_board, turn_into)]
        else:
            raise Exception('Unknown piece type')
        if len(pieces) > 1 and move_to_translate:
            raise Exception('Ambiguous piece')
        print(pieces)
        src_x = pieces[0][0]
        src_y = pieces[0][1]
        return [(src_x, src_y, x, y, piece_num, direction, in_board, turn_into)]


def process_game(game_in):
    board = create_board()
    print(board)
    white_in = True
    magnus_white = game_in.magnus_white
    for move in game_in.moves:
        print(move)
        for translation in translate_move(move, white_in, board):
            move_piece(*translation)
        print(board)
        white_in = not white_in

    return


games = parse_games_in_file('../Carlsen.pgn')

for game in games:
    process_game(game)

print(time.time() - start_time)
