import json

file = open('MagnusCarlsen.pgn','r')
contents = file.read()
string = ''
openBrackets = False
openQuotes = False
j=0
print(contents)
for i in contents:
    if i == '[':
        openBrackets = True
    if openBrackets == False:
        if i == ' ':
            #print(string)
            if string.endswith('.')==False:
                print(string)
                #print('')
            string = ''
        else:
            string = string + i
    else:
        #there be some code that manages which player is magnus
        if i == '[' or i == ']':
            if string != ' ' and string != '\n':
                print(string)
                string = ''
        else:
            string = string + i
    if i == ']':
        openBrackets = False


