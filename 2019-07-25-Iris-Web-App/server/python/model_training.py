# import numpy as np
# import pandas as pd
import tensorflow as tf
tf.enable_eager_execution()
# from sklearn.datasets import load_iris

# iris = load_iris()
# xdat = iris.data
# ydat = iris.target

# def partition(xdat: np.ndarray, ydat: np.ndarray, ratio: float = 0.3) -> tuple:
#     scnt = xdat.shape[0] / np.unique(ydat).shape[0]
#     ntst = int(xdat.shape[0] * ratio / (np.unique(ydat)).shape[0])
#     idx  = np.random.choice(np.arange(0, ydat.shape[0] / np.unique(ydat).shape[0], dtype = int), ntst, replace = False)
#     for i in np.arange(1, np.unique(ydat).shape[0]):
#         idx = np.concatenate((idx, np.random.choice(np.arange((scnt * i), scnt * (i + 1), dtype = int), ntst, replace = False)))

#     xtrn = xdat[np.where(~np.in1d(np.arange(0, ydat.shape[0]), idx))[0], :]
#     ytrn = ydat[np.where(~np.in1d(np.arange(0, ydat.shape[0]), idx))[0]]
#     xtst = xdat[idx, :]
#     ytst = ydat[idx]

#     return (xtrn, ytrn, xtst, ytst)

# xtrn, ytrn, xtst, ytst = partition(xdat, ydat); batch_size = 15

# Specify the model
model = tf.keras.models.Sequential([
    tf.keras.layers.Dense(10, activation = "relu"),
    tf.keras.layers.Dense(3, activation = "softmax")
])

# Specify the loss, optimizers and metrics for model training
model.compile(
    optimizer = "adam",
    loss = "sparse_categorical_crossentropy",
    metrics = ["accuracy"]
)

# Train the model for 100 epochs
def train_model(xtrn, ytrn, xtst, ytst, batch_size):
    model.fit(xtrn, ytrn, validation_data = (xtst, ytst), batch_size = batch_size, shuffle = True, epochs = 100)
