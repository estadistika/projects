import requests
import json

resp = requests.post("http://localhost:8081", data = json.dumps({"Hello": "World!"}))
print(resp.json())