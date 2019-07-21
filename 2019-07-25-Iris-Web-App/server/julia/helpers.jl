using Knet

# Define the dense layer
struct Dense; w; b; f; end
Dense(i::Int, o::Int, f = relu) = Dense(param(o, i), param0(o), f); # constructor
(d::Dense)(x) = d.f.(d.w * x .+ d.b); # define method for dense layer

# Define the chain layer
struct Chain; layers; end
(c::Chain)(x) = (for l in c.layers; x = l(x); end; x); # define method for feed-forward
(c::Chain)(x, y) = nll(c(x), y, dims = 1); # define method for negative-log likelihood loss function

# Define the accuracy function
function accuracy(m::Chain, d::Knet.Data)
    _, yidx = findmax(m(d.x), dims = 1);
    yprd = [i[1] for i in yidx];

    return sum(yprd .== d.y) / length(d.y)
end