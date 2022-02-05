//// content-script.js ////


document.body.style.backgroundColor = "orange";
document.addEventListener('keydown', addSearchBar);
const searchBar = document.createElement("div");
let show = true;
searchBar.id = "taojin-searchbar";
searchBar.classNmae = "taojin-searchbar";
searchBar.innerHTML = (`
  <input placeholder="搜索网页" id="input-el" class="input-el" onclick="search"></input>`
);
function controlSearchBar() {
  if (show) {
    document.body.append(searchBar);
  } else {
    searchBar.remove();
  }
  show = !show;
}
function addSearchBar(e) {
  if ('q' === e.key && e.ctrlKey) {
    controlSearchBar()
  }
}
function search(e) {
  const searchValue = document.getElementById("search-bar").value;
  if (e.key === "Enter" && searchValue) {
    controlSearchBar()
    const searchContent = document.createElement("iframe");
    searchContent.src=hrome.runtime.getURL(`https://cn.bing.com/search?q=${searchValue}`);
    searchContent.className="search-content";
    document.body.append(searchContent);
  }
}







// let searchbar = document.createElement("iframe");
// searchbar.src = chrome.runtime.getURL("../../taojin/searchbar/index.html");
// searchbar.className = "taojin-searchbar";
// searchbar.sandbox = "allow-same-origin allow-scripts allow-modals allow-popups";
// document.body.append(searchbar);