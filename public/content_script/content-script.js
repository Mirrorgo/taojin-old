//// content-script.js ////
document.body.style.backgroundColor = "orange";
let searchbar = document.createElement("iframe");
searchbar.src = chrome.runtime.getURL("index.html");
// "chrome-extension://llgmdnnodeomlbdnkckaineblidoahia/taojin/searchbar.html";
// "https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik";
searchbar.id = "taojin-searchbar";
// searchbar.sandbox = "allow-same-origin allow-scripts";
// document.body.insertBefore(searchbar, document.body.firstChild);
document.body.appendChild(searchbar);
