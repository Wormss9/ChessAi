from keras.models import *
from keras.layers import *
from keras.callbacks import EarlyStopping
from keras.optimizers import *
import matplotlib.pyplot as plt
import csv
import h5py

param = 1

early_stopping = EarlyStopping(monitor='val_loss', patience=10)
print('Reading Input:')
boards = np.loadtxt("./training_data/train-boards.csv",delimiter=",")
input_shape = boards.shape[1]
print('Done')
print('Reading Output:')
moves = np.loadtxt("./training_data/train-moves.csv",delimiter=",")
output_shape = moves.shape[1]
print('Done')
print('All read..')
# Stop after validation loss hasn't dropped for 5 epochs
early_stopping = EarlyStopping(monitor='val_acc', patience=5)

model = Sequential()
# Input layer
model.add(Dense(64, input_shape=(input_shape,), activation='relu'))
# Intermediate layers
model.add(Dense(64, activation='relu'))
model.add(Dense(64, kernel_initializer='uniform', activation='relu'))
#model.add(Dense(64, kernel_initializer='uniform', activation='relu'))
#model.add(Dense(64, kernel_initializer='uniform', activation='relu'))
# Output layer
model.add(Dense(output_shape, kernel_initializer='uniform', activation= 'relu'))
# Compiling model
model.compile(Adam(lr = 0.01), loss='mse', metrics=['acc'])
# Fitting model
history = model.fit(boards,moves, batch_size=int(input_shape), validation_split=0.1, epochs=100, verbose = 2)
model.save('./model.h5')