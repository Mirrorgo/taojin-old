//// content-script.js ////
document.body.style.backgroundColor = "orange";
let searchbar = document.createElement("iframe");
searchbar.src = chrome.runtime.getURL("../../taojin/searchbar/index.html");
searchbar.className = "taojin-searchbar";
searchbar.sandbox = "allow-same-origin allow-scripts allow-modals allow-popups";
document.body.append(searchbar);


