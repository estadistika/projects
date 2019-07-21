@info "Loading libraries"
using CSV: write
using DataFrames: DataFrame
using Knet
using Random
using RDatasets
using StatsBase: sample

@info "Loading iris data"
iris = dataset("datasets", "iris");
xdat = Matrix(iris[:, 1:4]);
ydat = iris[:, 5];
ydat = map(x -> x == "setosa" ? 1 : x == "versicolor" ? 2 : 3, ydat);

function partition(xdat::Array{<:AbstractFloat, 2}, ydat::Array{<:Int, 1}, ratio::AbstractFloat = 0.3)
    scnt = size(xdat, 1) / length(unique(ydat));
    ntst = Int(ceil((size(xdat, 1) * ratio) / length(unique(ydat))));
    idx  = Int.(sample(1:(length(ydat) / length(unique(ydat))), ntst, replace = false));
    for i in 2:length(unique(ydat))
        idx = vcat(idx, Int.(sample(((scnt * (i - 1)) + 1):(scnt * i), ntst, replace = false)));
    end
    xtrn = xdat[.!in.(1:length(ydat), Ref(Set(idx))), :];
    ytrn = ydat[.!in.(1:length(ydat), Ref(Set(idx)))];
    xtst = xdat[idx, :];
    ytst = ydat[idx];    

    return (xtrn, ytrn, xtst, ytst);
end

@info "Partitioning data"
xtrn, ytrn, xtst, ytst = partition(xdat, ydat);

dtrn = minibatch(Float32.(xtrn'), ytrn, 10, shuffle = true);
dtst = minibatch(Float32.(xtst'), ytst, 10);
