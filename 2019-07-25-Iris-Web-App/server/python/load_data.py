print("Info: Loading libraries")
import numpy as np
from sklearn.datasets import load_iris

print("Info: Loading iris data")
iris = load_iris()
xdat = iris.data
ydat = iris.target

# Define function for partitioning the data
def partition(xdat: np.ndarray, ydat: np.ndarray, ratio: float = 0.3) -> tuple:
    scnt = xdat.shape[0] / np.unique(ydat).shape[0]
    ntst = int(xdat.shape[0] * ratio / (np.unique(ydat)).shape[0])
    idx  = np.random.choice(np.arange(0, ydat.shape[0] / np.unique(ydat).shape[0], dtype = int), ntst, replace = False)
    for i in np.arange(1, np.unique(ydat).shape[0]):
        idx = np.concatenate((idx, np.random.choice(np.arange((scnt * i), scnt * (i + 1), dtype = int), ntst, replace = False)))

    xtrn = xdat[np.where(~np.in1d(np.arange(0, ydat.shape[0]), idx))[0], :]
    ytrn = ydat[np.where(~np.in1d(np.arange(0, ydat.shape[0]), idx))[0]]
    xtst = xdat[idx, :]
    ytst = ydat[idx]

    return (xtrn, ytrn, xtst, ytst)

print("Info: Partitioning data")
xtrn, ytrn, xtst, ytst = partition(xdat, ydat); batch_size = 15