# Specify the model
@info "Specifying the model"
model = Chain((Dense(size(xtrn, 2), 10), Dense(10, 3, identity)));

# Train the model for 100 epochs
@info "Training the model"
adam!(model, repeat(dtrn, 100));