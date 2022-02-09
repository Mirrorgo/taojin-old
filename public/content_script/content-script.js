//// content-script.js ////
const searchTools = [
  {
    name: "bing",
    url: "https://cn.bing.com/search?q=",
  }, {
    name: "baidu",
    url: "https://www.baidu.com/s?wd=",
  }
];
const searchContentButton = document.createElement("button");
searchContentButton.className = "search-content-button";
searchContentButton.innerHTML = "<div>T</div>";
searchContentButton.addEventListener("click", showSearchContent);
moveCol(searchContentButton);
console.log(searchContentButton)
document.body.appendChild(searchContentButton);


// 创建搜索框
document.addEventListener("keydown", addSearchBar());
const hideSearchContentList = [];
const searchBar = document.createElement("div");
let show = true;
searchBar.id = "taojin-searchbar";
searchBar.className = "taojin-searchbar";

const inputEl = document.createElement("input");
inputEl.id = "search-input";
inputEl.className = "search-input";
inputEl.placeholder = searchTools[0].name;
inputEl.addEventListener("keydown", search());
inputEl.addEventListener("blur", function () {
  searchBar.remove();
});

searchBar.appendChild(inputEl);
// 是否显示搜索框
function controlSearchBar() {
  console.log(show, searchBar);
  if (show) {
    document.body.appendChild(searchBar);
    inputEl.focus();
  } else {
    inputEl.blur();
  }
  show = !show;
}
// 控制搜索框是否显示
function addSearchBar() {
  let step = 0;
  return function (e) {
    if (step === 0 && e.ctrlKey) {
      step = 1;
    } else if (step === 1 && e.key === "q") {
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
      addSearchContent(searchTools[searchTool].url + searchValue, searchTools[searchTool].name);
      return false;

    }
  }

}

// 显示隐藏
function showSearchContent() {
  for (const el of hideSearchContentList) {
    el.style.display = "block";
  }
}

// 添加搜索内容
let maxZindex = 9999;
function addSearchContent(url, name) {
  // 搜索结果框体
  const searchContentBox = document.createElement("div");
  searchContentBox.className = "search-content-box";
  searchContentBox.style.zIndex = maxZindex++;
  searchContentBox.addEventListener("mousedown", function () {
    searchContentBox.style.zIndex = maxZindex++;
    console.log(maxZindex);
  })
  // 顶部
  const searchContentBar = document.createElement("div");
  searchContentBar.className = "search-content-bar";
  move(searchContentBox, searchContentBar);
  // 关闭
  const deleteButton = document.createElement("button");
  deleteButton.className = "content-bar-button";
  deleteButton.innerHTML = "X";
  deleteButton.addEventListener("click", function () {
    searchContentBox.remove()
  });
  // 隐藏
  const hideButton = document.createElement("button");
  hideButton.className = "content-bar-button";
  hideButton.innerHTML = "<";
  hideButton.addEventListener("click", function () {
    hideSearchContentList.push(searchContentBox);
    searchContentBox.style.display = "none";
  });

  searchContentBar.appendChild(deleteButton);
  searchContentBar.appendChild(hideButton);

  // 搜索结果
  let searchContent = null;
  switch (name) {
    case "bing":
      searchContent = document.createElement("iframe");
      searchContent.src = url;
      searchContent.className = "bing-search-content";
      break;
    case "baidu":
      searchContent = baiduSearchContent(url);
      break;
    default:
      console.error("不支持这个搜索引擎");
      break;
  }
  searchContentBox.appendChild(searchContentBar);
  searchContentBox.appendChild(searchContent);
  document.body.appendChild(searchContentBox);
}
function baiduSearchContent(url) {
  const searchContent = document.createElement("div");
  searchContent.className = "baidu-search-content";
  chrome.runtime.sendMessage(url + "&tn=json&rn=50", ({ feed: response }) => {
    console.log(url, response);
    const { entry } = response;
    for (const { abs, title, url } of entry) {
      if(!title) {
        continue;
      }
      searchContent.innerHTML += `
        <section>
          <h3>
            <a href="${url}" target="_blank">${title}</a>
          </h3>
          <div>${abs}</div>
        </section>
      `;
    }
  });
  return searchContent;
}
// 横向拖动
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
      if (lastX > window.screen.width - 600) {
        lastX = window.screen.width - 600;
      }

      box.style.left = lastX + "px";
    }, 10);
    return false;
  });
}
// 纵向拖动
function moveCol(box) {
  box.addEventListener("mousedown", function (e) {
    const eleY = box.offsetTop;
    const startY = e.clientY;
    document.onmouseup = function () {
      document.onmousemove = null;
    };
    document.onmousemove = throttle(function (e) {
      let lastY = eleY + e.clientY - startY;
      if (lastY < 10) {
        lastY = 10;
      }
      console.log(document.body.clientHeight, window.screen.height)
      if (lastY > window.screen.height - 256) {

        lastY = window.screen.height - 256;
      }
      box.style.top = lastY + "px";
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