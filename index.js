let video = document.querySelector("video");
//navigation with our media devices
let x = navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//variables
let recorder;
let recorderFlag = false;
let chunkData = [];
//recorder functionality with value which is provide by navigator in the form of promise
x.then((value) => {
  video.srcObject = value;
  recorder = new MediaRecorder(value);
  //start recording
  recorder.addEventListener("start", () => {
    chunkData = [];
  });
  ///data available in the form of chunk data
  recorder.addEventListener("dataavailable", (chunk) => {
    chunkData.push(chunk.data);
  });
  ///stop event that is provide by recorder
  recorder.addEventListener("stop", () => {
    let blob = new Blob(chunkData, { type: "video/mp4" });
    //let videoURL = URL.createObjectURL(blob);
    // let a = document.createElement("a");
    // a.href = videoURL;
    // a.download = `live_streaming_record_${new Date()}.mp4`;
    // a.click();
    //prepare an transaction
    //apply transaction to objectStore
    /// addvideo to store

    if (database) {
      let id = uuid.v4();
      let transaction = database.transaction("video", "readwrite");
      let videoStore = transaction.objectStore("video");
      let entry = {
        id: id,
        videoData: blob,
      };
      videoStore.add(entry);
      console.log(videoStore);
    }
  });
});
//recorder button functionality
let recordBtn = document.querySelector(".record-btn");
recordBtn.addEventListener("click", () => {
  recorderFlag = !recorderFlag;
  if (recorderFlag) {
    recorder.start();
    startTimer();
    recordBtn.classList.add("Btn-anim");
  } else {
    recorder.stop();
    stopTimer();
    recordBtn.classList.remove("Btn-anim");
  }
});

let counter = 0;
let timer = document.querySelector(".timer");
let clear;
// start timer for the video recording
function startTimer() {
  clear = setInterval(() => {
    let totalseconds = counter;
    let hour = Number.parseInt(totalseconds / 3600);
    totalseconds = totalseconds % 3600;
    let minute = Number.parseInt(totalseconds / 60);
    totalseconds = totalseconds % 60;
    let sec = totalseconds;
    hour = hour < 10 ? `0${hour}` : `${hour}`;
    minute = minute < 10 ? `0${minute}` : `${minute}`;
    sec = sec < 10 ? `0${sec}` : `${sec}`;
    timer.innerText = `${hour}:${minute}:${sec}`;
    // console.log(counter);
    counter++;
  }, 1000);
}
//stop timer
function stopTimer() {
  console.log("stop timer");
  clearInterval(clear);
  timer.innerText = "00:00:00";
}

// cspture button functionality
let filterColor = "transparent";
let captureButton = document.querySelector(".capture-btn");
captureButton.addEventListener("click", () => {
  // console.log("captureButton clicked");
  captureButton.classList.add("Capture-anim");
  setTimeout(() => {
    captureButton.classList.remove("Capture-anim");
  }, 1000);
  const canvas = document.createElement("canvas");
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  /// filter applying
  ctx.fillStyle = filterColor;
  ctx.fillRect(0, 0, canvas.height, canvas.width);
  ///getting url
  let screenshotURL = canvas.toDataURL();
  /// downloadImages -
  let a = document.createElement("a");
  a.href = screenshotURL;
  a.download = `screenshot_of_web_app_${new Date()}.jpg`;
  a.click();
});

/// change filter on screen
let filterLayer = document.querySelector(".filter-layer");
let filters = document.querySelectorAll(".filter");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    let bgc = getComputedStyle(filter).getPropertyValue("background-color");
    filterLayer.style.backgroundColor = bgc;
    filterColor = bgc;
  });
});
