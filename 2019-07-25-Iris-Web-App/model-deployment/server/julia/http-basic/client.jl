using HTTP
using JSON

resp = HTTP.request("POST", "http://localhost:8081", [], JSON.json(Dict("Hello" => "World!")));
@show JSON.parse(String(resp.body))