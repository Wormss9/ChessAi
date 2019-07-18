import json

file = open('MagnusCarlsen.pgn','r')
contents = file.read()
string = ''
openBrackets = False
openQuotes = False
j=0
moves = []
game = []
games = []

for i in contents:
    if i == '[':
        if moves != []:
            game.append(moves)
            games.append(game)
        moves.clear()
        openBrackets = True
    if openBrackets == False:
        if i == ' ':
            if string.endswith('.')==False:
                moves.append(string)
            string = ''
        else:
            string = string + i
    else:
        #there be some code that manages which player is magnus
        if i == ']':
            if 'Carlsen, Magnus' in string:
                game.append(j)
                j = j + 1
                game.append(string[:5])
                print(j)
            string = ''
        elif i == '[':
            string = ''
        else:
            string = string + i
    if i == ']':
        openBrackets = False



