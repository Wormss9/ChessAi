from keras.models import *
from keras.layers import *
from keras.callbacks import EarlyStopping
from keras.optimizers import *
from keras.losses import categorical_crossentropy
import matplotlib.pyplot as plt
import csv
import h5py
import numpy as np
import os
import time
import pandas as pd

os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
filenumber=1
print('Reading Input:')
readStart=time.time()
boards = pd.read_csv("./data/wb"+str(filenumber)+".csv",delimiter=",").to_numpy()
input_shape = boards.shape[1]
print("Done in %.0f" % ((time.time()-readStart)/60) +
      " minutes and %.2f" % ((time.time()-readStart) % 60)+" seconds")
print('Reading Output:')
readStart=time.time()
moves = pd.read_csv("./data/wm"+str(filenumber)+".csv",delimiter=",").to_numpy()/8
print(moves)
output_shape = moves.shape[1]
print("Done in %.0f" % ((time.time()-readStart)/60) +
      " minutes and %.2f" % ((time.time()-readStart) % 60)+" seconds")
print('All read..')
# Stop after validation loss hasn't dropped for 5 epochs
early_stopping = EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True)

model = Sequential()
# Input layer
model.add(Dense(64, input_shape=(input_shape,), activation='sigmoid'))
# Intermediate layers
model.add(Dense(64, activation='sigmoid'))
model.add(Dense(64, kernel_initializer='uniform', activation='sigmoid'))
model.add(Dense(64, kernel_initializer='uniform', activation='sigmoid'))
model.add(Dense(64, kernel_initializer='uniform', activation='sigmoid'))
model.add(Dense(64, kernel_initializer='uniform', activation='sigmoid'))
model.add(Dense(64, kernel_initializer='uniform', activation='sigmoid'))
model.add(Dense(64, kernel_initializer='uniform', activation='sigmoid'))
model.add(Dense(64, kernel_initializer='uniform', activation='sigmoid'))
# Output layer
model.add(Dense(output_shape, kernel_initializer='uniform', activation='sigmoid'))
# Compiling model
model.compile(Adam(lr = 0.1), loss='mse', metrics=['acc'])
# Fitting model
history = model.fit(boards,moves, batch_size=round(int(input_shape)/2), callbacks=[early_stopping], epochs=1, verbose = 1)
model.save('models/whites1.h5')