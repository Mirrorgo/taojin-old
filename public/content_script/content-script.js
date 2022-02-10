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
let searchTool = 0;
const searchContentButton = document.createElement("button");
searchContentButton.className = "search-content-button";
searchContentButton.innerHTML = "<div>T</div>";
searchContentButton.addEventListener("click", showSearchContent);
moveCol(searchContentButton);
console.log(searchContentButton)
document.body.appendChild(searchContentButton);
const searchButton = document.createElement("button");
searchButton.className = "search-button";
searchButton.innerHTML = '<svg t="1644458796131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2072" width="32" height="32"><path d="M469.333333 768c-166.4 0-298.666667-132.266667-298.666666-298.666667s132.266667-298.666667 298.666666-298.666666 298.666667 132.266667 298.666667 298.666666-132.266667 298.666667-298.666667 298.666667z m0-85.333333c119.466667 0 213.333333-93.866667 213.333334-213.333334s-93.866667-213.333333-213.333334-213.333333-213.333333 93.866667-213.333333 213.333333 93.866667 213.333333 213.333333 213.333334z m251.733334 0l119.466666 119.466666-59.733333 59.733334-119.466667-119.466667 59.733334-59.733333z" p-id="2073"></path></svg>';
searchButton.addEventListener("click", controlSearchBar);
moveCol(searchButton);
document.body.appendChild(searchButton);

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
inputEl.placeholder = searchTools[0].name;
inputEl.autocomplete = "off";
inputEl.addEventListener("keydown", search());
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
function addSearchBar(e) {
  if (e.key === "q" && e.ctrlKey) {
    controlSearchBar();
  }
}
// 输入框的键盘事件
function search() {
  return function (e) {
    console.log(e);
    if (e.key === "Tab") {
      console.log("tab");
      searchTool = (searchTool + 1) % searchTools.length;
      inputEl.placeholder = searchTools[searchTool].name;
      inputEl.focus();
      e.preventDefault();
      return false;
    }
    const searchValue = inputEl.value;
    if (e.key === "Enter" && searchValue) {
      console.log(inputEl)
      controlSearchBar();
      addSearchContent(searchTools[searchTool].url + searchValue.replaceAll(" ", "+"));
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
function addSearchContent(url) {
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
  switch (searchTools[searchTool].name) {
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
    console.log("change");
    const url = "https://cn.bing.com/AS/Suggestions?&mkt=zh-cn&cvid=BCA9094E94944E14A2710F627C26008&qry=" + inputEl.value;
    searchPrompt.className = "bing-search-prompt";
    const message = {
      type: 2,
      url,
    }
    chrome.runtime.sendMessage(message, (response) => {
      searchPrompt.innerHTML = response
        .replaceAll(/(<script(.*?)>)(.|\n)*?(<\/script>)/g, "")
        .replaceAll(/(<li(.*?)stype="HS"(.*?)>)(.|\n)*?(<\/li>)/g, "");
      const nodeList = document.querySelectorAll(".sa_sg");
      for (let i = 0, len = nodeList.length; i < len; i++) {
        const node = nodeList[i]
        const promptVal = node.querySelector(".sa_tm_text").innerHTML.replaceAll(/<\/?strong>/g, "");
        node.addEventListener("mousedown", function () {
          addSearchContent(searchTools[searchTool].url + promptVal.replaceAll(" ", "+"));
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
  }
  chrome.runtime.sendMessage(message, ({ feed: { entry } }) => {
    console.log("kk")
    for (const { abs, title, url } of entry) {
      if (!title) {
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
// 防抖
function debounce(func, wait) {
  var timeout = null;
  let that = this;
  return function () {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
      console.log("1")
      func.apply(that, arguments)
    }, wait);
  }
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