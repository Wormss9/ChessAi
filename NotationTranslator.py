import json
import os

file = open('MagnusCarlsen.pgn','r')
contents = file.read()
string = ''
openBrackets = False
print(contents)
for i in contents:
    if i == '[':
        openBrackets = True
    if openBrackets == False:
        if i == ' ':
            #print(string)
            if string.endswith('.')==False:
                #print(string)
                print('')
            string = ''
        else:
            string = string + i
    else:
        #there be some code that manages which player is magnus
    if i == ']':
        openBrackets = False


