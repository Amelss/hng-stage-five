document.addEventListener("DOMContentLoaded", function () {
  let mediaRecorder;
  let recordedChunks = [];
  let desktopStream;
  const cameraToggle = document.getElementById("camera-toggle");
  const audioToggle = document.getElementById("audio-toggle");

cameraToggle.addEventListener("change", function () {
  if (this.checked) {
    alert("Camera Permission Requested");
  }
});

audioToggle.addEventListener("change", function () {
  if (this.checked) {
    alert("Audio Permission Requested");
  }
});


  async function startRecording() {
    try {
      desktopStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      mediaRecorder = new MediaRecorder(desktopStream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        const blobUrl = URL.createObjectURL(recordedBlob);

        const downloadLink = document.getElementById("download-link");
        downloadLink.href = blobUrl;
        downloadLink.style.display = "block";

        recordedChunks = [];
      };

      mediaRecorder.start();
      document.getElementById("start-record-button").style.display = "none";
      document.getElementById("stop-record-button").style.display = "block";
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      desktopStream.getTracks().forEach((track) => {
        track.stop();
      });
      document.getElementById("stop-record-button").style.display = "none";
    }
  }

  const startRecordButton = document.getElementById("start-record-button");
  const stopRecordButton = document.getElementById("stop-record-button");

  startRecordButton.addEventListener("click", startRecording);
  stopRecordButton.addEventListener("click", stopRecording);
});
