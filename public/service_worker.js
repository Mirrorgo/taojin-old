chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    fetch(message)
      .then(response => response.json())
      .then(json => sendResponse(json))
      .catch(err => sendResponse(err));
    return true;
  });