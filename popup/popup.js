document.addEventListener("DOMContentLoaded", function () {
 

  let mediaRecorder;
  let recordedChunks = [];
  let desktopStream;
  const cameraToggle = document.getElementById("camera-toggle");
  const audioToggle = document.getElementById("audio-toggle");

 
  async function startCameraAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
     
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }


  const startCameraButton = document.getElementById("camera-toggle");
  startCameraButton.addEventListener("click", startCameraAccess);


  function updateToggleButtonPosition(toggleInput) {
    const toggler = toggleInput.nextElementSibling.querySelector(".toggler");
    toggler.style.left = toggleInput.checked ? "22px" : "2px";
  }


  cameraToggle.addEventListener("change", function () {
    updateToggleButtonPosition(this);
    console.log("camera button clicked");
  });

  audioToggle.addEventListener("change", function () {
    updateToggleButtonPosition(this);
    console.log("audio button clicked");
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