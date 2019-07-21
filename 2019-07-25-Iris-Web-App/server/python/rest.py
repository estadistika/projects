from flask import Flask
from flask import request
from flask import jsonify
import json
import numpy as np

app = Flask(__name__)

@app.route("/classify", methods = ["POST"])
def classify():
    print("Info: Parsing request data")
    data = json.loads(request.get_data().decode())

    print("Info: Making prediction")
    resp = jsonify(classify_helper(data["data"]))

    print("Info: Sending response")
    resp.headers.add("Access-Control-Allow-Origin", "*")
    
    return resp

@app.route("/train", methods = ["POST"])
def train():
    print("Info: Requesting to train the model")
    resp = jsonify(train_helper())

    print("Info: Sending response")
    resp.headers.add("Access-Control-Allow-Origin", "*")

    return resp

def train_helper():
    train_model(xtrn, ytrn, xtst, ytst, batch_size);
    
    return json.dumps({"data" : str(model.evaluate(xtst, ytst)[1])})

def classify_helper(data):
    yidx = np.argmax(model.predict(np.array(data).reshape(1, 4)), axis = 1)[0]
    yprd = "💐 Setosa" if yidx == 0 else "🌷 Versicolor" if yidx == 1 else "🌺 Virginica"

    return json.dumps({"data" : yprd})

if __name__ == "__main__":
    from model_training import model, train_model
    
    print("Info: One-time loading of data")
    from load_data import xtrn, ytrn, xtst, ytst, batch_size

    app.run("127.0.0.1", "8082")