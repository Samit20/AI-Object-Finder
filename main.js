status = "";

objects = [];

function setup() {
    canvas = createCanvas(460, 400);
    canvas.center();

    video = createCapture(VIDEO);
    video.size(460, 400);
    video.hide();
}


function start() {
    objectDetector = ml5.objectDetector("cocossd", modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Objects";

    objectName = document.getElementById("object_name").value;
}

function modelLoaded() {
    console.log("Model Has been Loaded");
    status = true;
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        objects = results;
    }
}

function draw() {
    image(video, 0, 0, 460, 400);
    if (status != "") {
        objectDetector.detect(video, gotResult);
        for (i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status : Objects Detected";
            stroke("#984398");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + "" + percent + "%", objects[i].x, objects[i].y);
            noFill();
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if (objects[i].label == objectName) {
                video.stop();
                objectDetector.detect(gotResult);
                document.getElementById("object_status").innerHTML = objectName + "Found!";
                synth = window.speechSynthesis;
                utterThis = new SpeechSynthesisUtterance(objectName + "Found");
                synth.speak(utterThis);
            }
        }
    }
}