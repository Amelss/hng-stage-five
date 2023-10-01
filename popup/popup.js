let mediaRecorder; // Variable to store the MediaRecorder
let recordedChunks = []; // Array to store recorded video chunks
let desktopStream; // Store the selected desktop stream

// Function to start screen recording
async function startRecording() {
  try {
    desktopStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    mediaRecorder = new MediaRecorder(desktopStream);

    // Event listener to handle dataavailable event and save recorded chunks
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    // Event listener to handle stop event and display the recorded video
    mediaRecorder.onstop = () => {
      const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
      const blobUrl = URL.createObjectURL(recordedBlob);

      // You can provide a download link here
      const downloadLink = document.getElementById("download-link");
      downloadLink.href = blobUrl;
      downloadLink.style.display = "block";

      recordedChunks = []; // Reset recorded chunks
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
    desktopStream.getTracks().forEach((track) => {
      track.stop();
    });
    document.getElementById("stop-record-button").style.display = "none";
  }
}

// Add event listeners to the buttons
const startRecordButton = document.getElementById("start-record-button");
const stopRecordButton = document.getElementById("stop-record-button");

startRecordButton.addEventListener("click", startRecording);
stopRecordButton.addEventListener("click", stopRecording);
