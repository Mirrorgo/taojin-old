//// content-script.js ////
const searchToolList = [
  {
    name: "bing",
    url: "https://cn.bing.com/search?q=",
  },
  {
    name: "baidu",
    url: "https://www.baidu.com/s?wd=",
  },
];
let searchTool = 0;
const searchContentButton = document.createElement("button");
searchContentButton.className = "search-content-button";
searchContentButton.innerHTML = "<div>T</div>";
searchContentButton.addEventListener("click", showSearchContent);
moveY(searchContentButton);
document.body.appendChild(searchContentButton);
const searchBarButton = document.createElement("button");
searchBarButton.className = "search-bar-button";
searchBarButton.innerHTML =
  '<svg t="1644458796131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2072" width="32" height="32"><path d="M469.333333 768c-166.4 0-298.666667-132.266667-298.666666-298.666667s132.266667-298.666667 298.666666-298.666666 298.666667 132.266667 298.666667 298.666666-132.266667 298.666667-298.666667 298.666667z m0-85.333333c119.466667 0 213.333333-93.866667 213.333334-213.333334s-93.866667-213.333333-213.333334-213.333333-213.333333 93.866667-213.333333 213.333333 93.866667 213.333333 213.333333 213.333334z m251.733334 0l119.466666 119.466666-59.733333 59.733334-119.466667-119.466667 59.733334-59.733333z" p-id="2073"></path></svg>';
searchBarButton.addEventListener("click", controlSearchBar);
moveY(searchBarButton);
document.body.appendChild(searchBarButton);

// 创建搜索框
document.addEventListener("keydown", addSearchBar);
const hideSearchContentList = [];
const searchBar = document.createElement("div");
let show = true;
searchBar.id = "taojin-searchbar";
searchBar.className = "taojin-searchbar";

const inputEl = document.createElement("input");
inputEl.id = "search-input";
inputEl.className = "search-input";
inputEl.placeholder = searchToolList[0].name;
inputEl.autocomplete = "off";
inputEl.addEventListener("keydown", listenInputKey());
inputEl.addEventListener("input", getSearchPrompt());
inputEl.addEventListener("blur", function () {
  inputEl.value = "";
  searchPrompt.innerHTML = "";
  show = true;
  searchBar.remove();
});

const searchPrompt = document.createElement("div");

searchBar.appendChild(inputEl);
searchBar.appendChild(searchPrompt);
// 是否显示搜索框
function controlSearchBar() {
  if (show) {
    document.body.appendChild(searchBar);
    inputEl.focus();
    show = false;
  } else {
    inputEl.blur();
    show = true;
  }
}
// 控制搜索框是否显示
function addSearchBar(e) {
  if (e.key === "q" && e.ctrlKey) {
    controlSearchBar();
  }
}
// 输入框的键盘事件
function listenInputKey() {
  return function (e) {
    if (e.key === "Tab") {
      searchTool = (searchTool + 1) % searchToolList.length;
      inputEl.placeholder = searchToolList[searchTool].name;
      inputEl.focus();
      e.preventDefault();
      return false;
    }
    const searchValue = inputEl.value;
    if (e.key === "Enter" && searchValue) {
      controlSearchBar();
      addSearchContent(
        searchToolList[searchTool].url + searchValue.replaceAll(" ", "+")
      );
      return false;
    }
  };
}

// 显示隐藏
function showSearchContent() {
  for (const el of hideSearchContentList) {
    el.style.display = "block";
  }
}

// 添加搜索内容
let maxZindex = 9999;
function addSearchContent(url) {
  // 搜索结果框体
  const searchContentBox = document.createElement("div");
  searchContentBox.className = "search-content-box";
  searchContentBox.style.zIndex = maxZindex++;
  searchContentBox.addEventListener("mousedown", function () {
    searchContentBox.style.zIndex = maxZindex++;
  });
  // 顶部
  const searchContentBar = document.createElement("div");
  searchContentBar.className = "search-content-bar";
  moveX(searchContentBox, searchContentBar);
  // 关闭
  const deleteButton = document.createElement("button");
  deleteButton.className = "content-bar-button";
  deleteButton.innerHTML = "X";
  deleteButton.addEventListener("click", function () {
    searchContentBox.remove();
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
  switch (searchToolList[searchTool].name) {
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
// https://cn.bing.com/AS/Suggestions?pt=page.serp&bq=bing+%E6%90%9C%E7%B4%A2%E6%8F%90%E7%A4%BA&mkt=zh-cn&ds=mobileweb&qry=bing%20s&asv=1&cp=6&msbqf=false&cvid=3A600DD985FD402997901DCF658A08FD
// 搜索提示
function getSearchPrompt() {
  return debounce(function () {
    const url =
      "https://cn.bing.com/AS/Suggestions?&mkt=zh-cn&cvid=BCA9094E94944E14A2710F627C26008&qry=" +
      inputEl.value;
    searchPrompt.className = "bing-search-prompt";
    const message = {
      type: 2,
      url,
    };
    chrome.runtime.sendMessage(message, (response) => {
      searchPrompt.innerHTML = response
        .replaceAll(/(<script(.*?)>)(.|\n)*?(<\/script>)/g, "")
        .replaceAll(/(<li(.*?)stype="HS"(.*?)>)(.|\n)*?(<\/li>)/g, "");
      const nodeList = document.querySelectorAll(".sa_sg");
      for (let i = 0, len = nodeList.length; i < len; i++) {
        const node = nodeList[i];
        const promptVal = node
          .querySelector(".sa_tm_text")
          .innerHTML.replaceAll(/<\/?strong>/g, "");
        node.addEventListener("mousedown", function () {
          addSearchContent(
            searchToolList[searchTool].url + promptVal.replaceAll(" ", "+")
          );
          // controlSearchBar();
        });
      }
    });
  }, 500);
}

// 百度搜索结果
function baiduSearchContent(url) {
  const searchContent = document.createElement("div");
  searchContent.className = "baidu-search-content";
  const message = {
    url: url + "&tn=json&rn=50",
    type: 1,
  };
  chrome.runtime.sendMessage(message, ({ feed: { entry } }) => {
    for (const { abs, title, url } of entry) {
      if (!title) {
        continue;
      }
      searchContent.innerHTML += `
        <section>
          <h3>
            <a href="${url}">${title}</a>
          </h3>
          <div>${abs}</div>
        </section>
      `;
    }
  });
  return searchContent;
}
// 横向拖动
function moveX(box, moveBar) {
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
function moveY(box) {
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
      if (lastY > window.screen.height - 256) {
        lastY = window.screen.height - 256;
      }
      box.style.top = lastY + "px";
    }, 10);
    return false;
  });
}
// 防抖
function debounce(func, wait) {
  var timeout = null;
  let that = this;
  return function () {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
      func.apply(that, arguments);
    }, wait);
  };
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
  };
}
console.log("over");

// let searchbar = document.createElement("iframe");
// searchbar.src = chrome.runtime.getURL("../../taojin/searchbar/index.html");
// searchbar.className = "taojin-searchbar";
// searchbar.sandbox = "allow-same-origin allow-scripts allow-modals allow-popups";
// document.body.appendChild(searchbar);
let icon = document.createElement("img");
let selectedMessage = "";
icon.src =
  "data:image/png;base64,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";
document.body.appendChild(icon);
icon.style.position = "absolute";
icon.style.visibility = "hidden";
icon.style.height = "25px";
icon.style.width = "25px";
icon.style.cursor = "pointer";
icon.style.zIndex = "10000";
icon.onclick = (ev) => {
  console.log("点击");
};

document.onmouseup = function (e) {
  selection(e);
};

function selection(e) {
  //获取Selection对象
  let selection = window.getSelection().toString();
  //调用selection对象的toString()方法就可以获取鼠标拖动选中的文本。
  if (selection.toString() === "") {
    icon.style.visibility = "hidden";
  } else if (selection.toString() !== selectedMessage) {
    console.log("选中的文本为：");
    console.log(selection.toString());
    icon.style.visibility = "visible";
    icon.style.left = e.pageX + 8 + "px";
    icon.style.top = e.pageY + 8 + "px";
    selectedMessage = selection.toString();
  }
}
