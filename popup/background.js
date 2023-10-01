chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "recordScreen") {
    port.onMessage.addListener(function (msg) {
      if (msg.action === "startRecording") {
        chrome.desktopCapture.chooseDesktopMedia(
          ["screen", "window"],
          port.sender.tab,
          function (streamId) {
            if (streamId) {
              port.postMessage({ action: "gotStream", streamId });
            } else {
              port.postMessage({ action: "getUserMediaError" });
            }
          }
        );
      }
    });
  }
});
