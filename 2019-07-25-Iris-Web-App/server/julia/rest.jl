using HTTP
using JSON

# @info "Loading the model"
include("helpers.jl")

function classify(req::HTTP.Request)    
    @info "Parsing request data"
    data = JSON.parse(String(req.body))
    
    @info "Making prediction"
    _, yidx = findmax(model(data["data"]));
    yprd = yidx == 1 ? "💐 Setosa" : yidx == 2 ? "🌷 Versicolor" : "🌺 Virginica";
    
    @info "Sending response"
    return HTTP.Response(200, [HTTP.setheader(req, "Access-Control-Allow-Origin" => "*")], body = JSON.json(Dict("data" => yprd)), request = req)
end

function train(req::HTTP.Request)
    @info "Requesting to train the model"
    include("./server/julia/model-training.jl")
    accy = accuracy(model, dtst)

    @info "Sending response"
    return HTTP.Response(200, [HTTP.setheader(req, "Access-Control-Allow-Origin" => "*")], body = JSON.json(Dict("data" => accy)), request = req)
end

classifier = HTTP.Router()
HTTP.@register(classifier, "POST", "/classify", classify)

trainer = HTTP.Router()
HTTP.@register(trainer, "POST", "/train", train)

@info "One-time loading of data"
include("load-data.jl")

@info "Listening at 127.0.0.1:8081"
HTTP.listen("127.0.0.1", 8081) do io::HTTP.Stream
    if io.message.target === "/classify"
        HTTP.handle(classifier, io)
    elseif io.message.target === "/train"
        HTTP.handle(trainer, io)
    else
        @info "Oops"
    end
end