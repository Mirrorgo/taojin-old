chrome.runtime.onMessage.addListener(({ type, url }, sender, sendResponse) => {
  switch (type) {
    case 1:
      fetch(url)
        .then(response => response.json())
        .then(json => sendResponse(json))
        .catch(err => sendResponse(err));
      break;
    case 2:
      fetch(url)
        .then(response => response.text())
        .then(json => sendResponse(json))
        .catch(err => sendResponse(err));
      break;
  }
  return true;
});