//// content-script.js ////
// 创建搜索框
document.addEventListener('keydown', addSearchBar());
const searchBar = document.createElement("div");
const searchTools = [
  {
    name: "bing",
    url: "https://cn.bing.com/search?q=",
  }, {
    name: "baidu",
    url: "https://www.baidu.com/s?wd=",
  }
];
let show = true;
searchBar.id = "taojin-searchbar";
searchBar.className = "taojin-searchbar";

const inputEl = document.createElement("input");
inputEl.id = "search-input";
inputEl.className = "search-input";
inputEl.placeholder = searchTools[0].name;
inputEl.addEventListener('keydown', search());
// inputEl.addEventListener('blur',controlSearchBar);


searchBar.appendChild(inputEl);
// 是否显示搜索框
function controlSearchBar() {
  console.log(show, searchBar);
  if (show) {
    document.body.appendChild(searchBar);
    inputEl.focus();
  } else {
    searchBar.remove();
  }
  show = !show;
}
// 控制搜索框是否显示
function addSearchBar() {
  let step = 0;
  return function (e) {
    if (step === 0 && e.ctrlKey) {
      step = 1;
    } else if (step === 1 && e.key === 'q') {
      controlSearchBar();
      step = 0;
    } else {
      step = 0;
    }
  }
}
// 输入框的键盘事件
function search() {
  let searchTool = 0;
  return function (e) {
    console.log(e);
    const inputEl = document.getElementById("search-input");
    if (e.key === "Tab") {
      console.log("tab");
      searchTool = (searchTool + 1) % searchTools.length;
      inputEl.placeholder = searchTools[searchTool].name;
      inputEl.focus();
      e.preventDefault();
    }
    const searchValue = inputEl.value;
    if (e.key === "Enter" && searchValue) {
      console.log(inputEl)
      inputEl.value = "";
      controlSearchBar();
      addSearchContent(searchTools[searchTool].url + searchValue);
      return false;

    }
  }

}
// 添加搜索内容
let maxZindex = 9999;
function addSearchContent(url) {
  // 搜索结果框体
  const searchContentBox = document.createElement("div");
  searchContentBox.className = "search-content-box";
  searchContentBox.style.zIndex = maxZindex++;
  searchContentBox.addEventListener('mousedown', function () {
    searchContentBox.style.zIndex = maxZindex++;
    console.log(maxZindex);
  })
  // 顶部
  const searchContentBar = document.createElement("div");
  searchContentBar.className = "search-content-bar";
  move(searchContentBox, searchContentBar);
  // 关闭
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = "x";
  deleteButton.addEventListener("click", function () {
    searchContentBox.remove()
  });
  searchContentBar.appendChild(deleteButton);

  // 搜索结果
  const searchContent = document.createElement("iframe");
  searchContent.src = url;
  searchContent.className = "search-content";



  searchContentBox.appendChild(searchContentBar);
  searchContentBox.appendChild(searchContent);
  document.body.appendChild(searchContentBox);
}
// 拖动
function move(box, moveBar) {
  moveBar.addEventListener("mousedown", function (e) {
    const eleX = box.offsetLeft;
    const startX = e.clientX;
    document.onmouseup = function () {
      document.onmousemove = null;
    };
    document.onmousemove = throttle(function (e) {
      let lastX = eleX + e.clientX - startX;
      if (lastX < 0) {
        lastX = 0;
      }
      box.style.left = lastX + 'px';
    }, 10);
    return false;
  });
}
// 节流
function throttle(func, wait) {
  let previous = 0;
  return function () {
    let that = this;
    let now = Date.now();
    if (now - previous > wait) {
      func.apply(that, arguments);
      previous = now;
    }
  }
}
console.log("over");






// let searchbar = document.createElement("iframe");
// searchbar.src = chrome.runtime.getURL("../../taojin/searchbar/index.html");
// searchbar.className = "taojin-searchbar";
// searchbar.sandbox = "allow-same-origin allow-scripts allow-modals allow-popups";
// document.body.appendChild(searchbar);