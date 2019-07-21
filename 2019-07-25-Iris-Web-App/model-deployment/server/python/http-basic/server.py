from flask import Flask, jsonify, request
import json

app = Flask(__name__)

@app.route("/", methods = ["POST"])
def index():
    print("Request received!")
    data = request.get_data().decode(); 
    print(data)

    resp = jsonify(data); 
    resp.headers.add("Access-Control-Allow-Origin", "*")
    
    print("Sending response with <3")
    return resp

if __name__ == "__main__":
    app.run("127.0.0.1", "8081")