window.onload = function () {
    addListener();
};

function httpRequest(URL, data, callback) {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", URL, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let output = JSON.parse(this.responseText);
            callback(output);
        } else if (this.readyState === 4 && this.status !== 200) {
            callback(false)
        } else {
            console.log("readyState is " + this.readyState + " and status is " + this.status);
        }
    }
}

function addListener() {
    document.getElementById("classify").addEventListener("click", classify);
    document.getElementById("train").addEventListener("click", train);
    document.getElementById("option-julia").addEventListener("change", setJulia);
    document.getElementById("option-python").addEventListener("change", setPython);
}

function setJulia() {
    let jlServer = document.getElementById("option-julia");
    if (jlServer.checked) {
        status("Changed back-end server to Julia.", 2000)
    }
}

function setPython() {
    let pyServer = document.getElementById("option-python");
    if (pyServer.checked) {
        status("Changed back-end server to Python.", 2000)
    }
}

function classify() {
    let irisInputs = document.getElementsByClassName("iris-inputs");
    
    let data = []; 
    let nanCounter = 0; 
    let strCounter = 0;
    for (let i = 0; i < irisInputs.length; ++i) {
        if (isNaN(parseFloat(irisInputs[i].value)) && (irisInputs[i].value !== "")) {
            strCounter += 1;
        } else {
            data.push(parseFloat(irisInputs[i].value))
            if (isNaN(data[i])) {
                nanCounter += 1
            }
        }
    }
    let accy = document.getElementById("test-accuracy");
    let jlServer = document.getElementById("option-julia");

    if (jlServer.checked) {
        var url = "http://0.0.0.0:8081/classify";
    } else {
        var url = "http://0.0.0.0:8082/classify";
    }

    if ((jlServer.checked) && (accy.innerHTML[0] === "0")) {
        status("Knet.jl test accuracy is 0%, please train the model first.", 3000);
    } else if ((!jlServer.checked) && (accy.innerHTML[accy.innerHTML.lastIndexOf(";") + 2] === "0")) {
        status("TF-Keras test accuracy is 0%, please train the model first.", 3000);
    } else if (strCounter > 0) {
        status("Please enter integer/float values.", 3000);
    } else if (nanCounter > 0) {
        status("Please do not leave a blank field.", 3000);
    } else {
        status("Sending request to the server at http://0.0.0.0:8081/classify", 0, true);
        httpRequest(url, {"data" : data}, 
            function (output) {
                if (output === false) {
                    status("", 0);
                    status("Status: 0 (no response from the server), returning random prediction.", 3000);
                    let items = ["&#128144; Setosa", "&#127799; Versicolor", "&#127802; Virginica"]
                    let item = items[Math.floor(Math.random()*items.length)];
                    document.getElementById("output").innerHTML = item;
                } else {
                    let jlServer = document.getElementById("option-julia");
                    if (jlServer.checked) {
                        status("", 0);
                        status("Status: 200 (OK), processing prediction from Knet.jl model.", 2500);
                        document.getElementById("output").innerHTML = output["data"]
                    } else {
                        status("", 0);
                        status("Status: 200 (OK), processing prediction from TensorFlow-Keras model.", 2500);
                        document.getElementById("output").innerHTML = JSON.parse(output)["data"]
                    }
                }   
            }
        );
    }
}

function train() {
    let jlServer = document.getElementById("option-julia");

    if (jlServer.checked) {
        var url = "http://0.0.0.0:8081/train"
    } else {
        var url = "http://0.0.0.0:8082/train"
    }

    status('The model is now training.', 0, true);
    httpRequest(url, {"data" : "train"}, 
        function (output) {
            if (output === false) {
                updateAccuracy(output);
            } else {
                updateAccuracy(output);
            }
        }
    );
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function accuracyLab() {
    let jlServer = document.getElementById("option-julia");
    let accy = document.getElementById("test-accuracy");

    if (jlServer.checked) {
        if ((accy.innerHTML[2] !== "%") && (accy.innerHTML[2] !== " ")) {
            var labs = accy.innerHTML.slice(3,);
        } else if (accy.innerHTML[1] !== "%") {
            var labs = accy.innerHTML.slice(2,);
        } else {
            var labs = accy.innerHTML.slice(1,);
        }    
    } else {
        var refIdx1 = accy.innerHTML.indexOf(";");
        var refIdx2 = accy.innerHTML.indexOf("(TF");
        var labs1   = accy.innerHTML.slice(0, refIdx1);
        var labs2   = accy.innerHTML.slice(refIdx2 - 2,);
        var labs    = [labs1, labs2]
    }
    
    return [accy, labs]
}

function updateAccuracy(output) {
    let alab = accuracyLab()
    let accy = alab[0];
    let labs = alab[1];

    if (output === false) {
        status('', 0);
        status('The model is now training (mock-up because server is down).', 5000, true, () => {
            if (typeof labs === "string") {
                accy.innerHTML = getRndInteger(90, 100) + labs;
                status("Done! Updated Knet.jl test accuracy above.", 3000);
            } else {
                accy.innerHTML = labs[0] + "; " + getRndInteger(90, 100) + labs[1];
                status("Done! Updated TF-Keras test accuracy above.", 3000);
            }
            emphasize();
        });
    } else {
        status('', 0);
        if (typeof labs === "string") {
            accy.innerHTML = Math.round(output["data"] * 100) + labs; 
            status("Done! Updated Knet.jl test accuracy above.", 3000);
        } else {
            accy.innerHTML = labs[0] + "; " + Math.round(parseFloat(JSON.parse(output)["data"]) * 100) + labs[1];
            status("Done! Updated TF-Keras test accuracy above.", 3000);
        }
        emphasize();   
    }
}

function emphasize() {
    let accuracyDiv = document.getElementById("test-accuracy");
    accuracyDiv.classList.toggle("updated-accuracy")

    setTimeout(() => accuracyDiv.classList.toggle("updated-accuracy"), 3000);
}

function status(text, timeout, showLoading = false, callback = false) {
    let statusDiv = document.getElementById("status");

    if (showLoading) {
        statusDiv.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>' + text;
    } else {
        statusDiv.innerHTML = text;
    }
    if (timeout < 1) {
        statusDiv.classList.toggle("hidden");
    } else {
        statusDiv.classList.toggle("hidden");
        setTimeout(
            () => {
                if (callback === false) {
                    statusDiv.classList.toggle("hidden");
                } else {
                    callback()
                    statusDiv.classList.toggle("hidden");
                }
            }, 
            timeout
        )
    }
}