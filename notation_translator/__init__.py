import csv
import re
import numpy
from typing import List
from pandas import *
import time


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
    return (1, 0) if white else (-1, 8)


def sign(param):
    if param > 0:
        return 1
    if param ==0:
        return 0
    else:
        return -1


def create_board():
    board = numpy.zeros((8, 8))
    board[0, 0] = board[7, 0] = 1  # wr
    board[1, 0] = board[6, 0] = 2  # wh
    board[2, 0] = board[5, 0] = 3  # wb
    board[4, 0] = 5  # wk
    board[3, 0] = 4  # wq
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

board = create_board()


def translate_piece(value):
    return pieces.get(value)


def square_letter_to_num(letter):
    return square_number.get(letter.lower())


def move_piece(src_x, src_y, x, y, value, direction, in_board):
    in_board[src_x, src_y] = 0
    in_board[x, y] = value * direction
    return in_board


def pawn_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = direction*6
    pawn_pos: list = numpy.argwhere(in_board == value).tolist()
    result_list = []
    for i,j in pawn_pos.copy():
        if (src_x is not None and i != src_x) or (src_y is not None and j != src_y):
            pawn_pos.remove([i,j])
    for i,j in pawn_pos:
        if capture and x == j+direction and (y == i+1 or y == i-1) and in_board[x, y] != 0:
            result_list.append((i,j))
        elif j == starting_end + direction and x-i == 0 and y-j == 2*direction and in_board[x, y] == 0:
            result_list.append((i,j))
        elif x-i == 0 and y-j == direction and in_board[x, y] == 0:
            result_list.append((i,j))
    return result_list


def queen_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = direction * 4
    return generic_all_directions_move(src_x, src_y, x, y, in_board, value)


def bishop_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = direction * 3
    result_list = []
    for i, j in generic_all_directions_move(src_x, src_y, x, y, in_board, value):
        if abs(i-x) == abs(j-y):
            result_list.append((i,j))
    return result_list


def rook_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = direction
    result_list = []
    for i, j in generic_all_directions_move(src_x, src_y, x, y, in_board, value):
        if i-x == 0 or j-y == 0:
            result_list.append((i,j))
    return result_list


def king_move(src_x: int, src_y: int, x: int, y: int, capture: bool, white: bool, in_board: numpy.ndarray):
    direction, starting_end = find_direction(white)
    value = 5*direction
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
    for i,j in piece_pos:
        if (abs(x-i) == 1 and abs(y-j) == 2) or (abs(x-i) == 2 and abs(y-j) == 1):
            result_list.append((i,j))
    return result_list


def generic_all_directions_move(src_x: int, src_y: int, x: int, y: int, in_board: numpy.ndarray, value: int):
    piece_pos = numpy.argwhere(in_board == value).tolist()
    result_list = []
    append = True
    for i, j in piece_pos.copy():
        if (src_x is not None and i != src_x) or (src_y is not None and j != src_y):
            piece_pos.remove([i, j])
    for i, j in piece_pos.copy():
        if i - x == 0 or j - y == 0 or abs(i - x) == abs(j - y):
            start_x = i
            start_y = j
            if sign(in_board[x,y]) != 0 and sign(in_board[x,y]) == sign(value):
                append = False
            direction_x = sign(x-i)
            direction_y = sign(y-j)
            while abs(x-i)-1 > 0 and (y-j)-1 > 0:
                i += direction_x
                j += direction_y
                if in_board[i, j] != 0:
                    append = False
            if append:
                result_list.append((start_x, start_y))
    return result_list


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
                game.set_moves(moves.copy())
                games.append(game)
                moves.clear()
                game = Game()
        if not metadata:
            split_line = line.split()
            for i in split_line[:-1]:
                if '.' in i:
                    moves.append(i.split('.')[1])
                else:
                    moves.append(i)
            if split_line != []:
                game.set_result(split_line[-1])
        line = file.readline()
    return games

def translate_move(move: str, white: bool):
    piece_num = 6
    if move[0].isupper():
        piece_num = translate_piece(move[0])
        move = move[1:]
    piece_num = piece_num if white else piece_num*-1
    src_x = None
    src_y = None
    x = square_letter_to_num(move[-2])
    y = int(move[-1])-1
    capture = False
    move = move[:-2]
    for i in move:
        if i.isdigit():
            src_y = int(i)-1
        elif i == 'x':
            capture = True
        else:
            src_x = square_letter_to_num(i)

    return piece_num, src_x, src_y, x, y, capture
games = parse_games_in_file('../Carlsen.pgn')


for i in games:
    white = True
    for j in i.moves:
        print(j)
        print(translate_move(j, white))
        white = not white
    exit()