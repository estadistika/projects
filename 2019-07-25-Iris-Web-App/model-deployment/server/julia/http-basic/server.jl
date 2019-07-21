using HTTP
using JSON

function receive(req::HTTP.Request)  
    @info "Request received!"  
    data = JSON.parse(String(req.body)); @show data
    
    @info "Sending response with <3"  
    return HTTP.Response(200, [HTTP.setheader(req, "Access-Control-Allow-Origin" => "*")], body = JSON.json(data), request = req)
end

index = HTTP.Router()
HTTP.@register(index, "POST", "/", receive)

@info "Listening at 127.0.0.1:8081"
HTTP.listen("127.0.0.1", 8081) do io::HTTP.Stream
    HTTP.handle(index, io)
end