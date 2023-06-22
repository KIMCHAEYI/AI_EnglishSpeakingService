let classifier;
let video;
let speech;
let said;
let word = [];
var directionX;
let resultText = ""; // 추가된 변수

let poseNet;
let poses = [];

let pkeyHandX, pkeyHandY, keyHandX, keyHandY;

function setup() {
  createCanvas(800, 580);
  directionX = 1;

  video = createCapture(VIDEO);
  video.size(width, height);
  classifier = ml5.imageClassifier("MobileNet", video, modelReady);

  speech = new p5.SpeechRec("En-US", gotSpeech);
  speech.start(true, false);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });

  video.hide();
}

function modelReady() {
  console.log("Ready");
  classifyVideo();
}

function classifyVideo() {
  classifier.classify(gotResult);
}

function gotResult(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  clear();
  image(video, 0, 0, width, height);
  fill(255);
  textSize(22);
  let label = results[0].label;
  text(label, width - 100, 40);

  if (said && label.toLowerCase() === said.toLowerCase()) {
    resultText = "완벽해요!";
  } else {
    resultText = "화면의 영단어를 보고 발음해 보세요";
  }

  classifyVideo();
}

function gotSpeech() {
  if (speech.resultValue) {
    said = speech.resultString;
    word = said.split("");
    console.log(said);
  }
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();

  textSize(26);
  textAlign(RIGHT, BOTTOM);
  fill(228, 227, 205);
  text(said, width - 10, height - 10);

  textSize(30); // 글자 크기 수정
  textAlign(CENTER); // 가운데 정렬
  fill(176, 209, 221);
  text(resultText, width / 2, height / 2); // 화면 중앙에 표시
}

function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    let keypoint = pose.keypoints[9];
    if (keypoint.score > 0.2) {
      keyHandX = pkeyHandX;
      keyHandY = pkeyHandY;
      pkeyHandX = keypoint.position.x;
      pkeyHandY = keypoint.position.y;

      if (keyHandX > width / 2) {
        directionX = -1;
      }
      if (keyHandX < width / 2) {
        directionX = 1;
      }
      for (var j = 0; j < word.length; j++) {
        text(
          word[j],
          keyHandX + directionX * j * 10,
          random(keyHandY - 3, keyHandY + 3)
        );
        console.log(word[j]);
      }

      textSize(20);
      fill(148, 210, 121);

      for (var j = 0; j < word.length; j++) {
        text(
          word[j],
          keyHandX + directionX * j * 10,
          random(keyHandY - 3, keyHandY + 3)
        );
        console.log(word[j]);
      }
    }
  }
}
