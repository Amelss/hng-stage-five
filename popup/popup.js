// popup.js

let mediaRecorder; // Variable to store the MediaRecorder
let recordedChunks = []; // Array to store recorded video chunks

// Function to start screen recording
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    mediaRecorder = new MediaRecorder(stream);

    // Event listener to handle dataavailable event and save recorded chunks
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    // Event listener to handle stop event and display the recorded video
    mediaRecorder.onstop = () => {
      const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(recordedBlob);
      const recordedVideo = document.getElementById("recorded-video");
      recordedVideo.src = videoUrl;
      recordedVideo.style.display = "block";
    };

    mediaRecorder.start();
    document.getElementById("start-record-button").style.display = "none";
    document.getElementById("stop-record-button").style.display = "block";
  } catch (error) {
    console.error("Error starting screen recording:", error);
  }
}

// Function to stop screen recording
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    document.getElementById("stop-record-button").style.display = "none";
    document.getElementById("download-button").style.display = "block"; // Show the download button after stopping recording
  }
}

// Function to handle downloading the recorded video
function downloadRecording() {
  const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
  const blobUrl = URL.createObjectURL(recordedBlob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = blobUrl;
  a.download = "recorded-video.webm";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

// Add event listeners to the buttons
const startRecordButton = document.getElementById("start-record-button");
const stopRecordButton = document.getElementById("stop-record-button");
const downloadButton = document.getElementById("download-button");

startRecordButton.addEventListener("click", startRecording);
stopRecordButton.addEventListener("click", stopRecording);
downloadButton.addEventListener("click", downloadRecording);


