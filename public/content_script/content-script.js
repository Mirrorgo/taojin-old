//// content-script.js ////


document.body.style.backgroundColor = "orange";
// 创建搜索框
document.addEventListener('keydown', addSearchBar());
const searchBar = document.createElement("div");
let show = true;
searchBar.id = "taojin-searchbar";
searchBar.className = "taojin-searchbar";

const inputEl = document.createElement("input");
inputEl.placeholder = "搜索网页";
inputEl.id = "search-input";
inputEl.addEventListener('keydown', search);

searchBar.appendChild(inputEl);
// 是否显示搜索框
function controlSearchBar() {
  console.log(show, searchBar);
  if (show) {
    document.body.appendChild(searchBar);
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
// 搜索
function search(e) {
  console.log(e);
  const searchValue = document.getElementById("search-input").value;
  if (e.key === "Enter" && searchValue) {
    controlSearchBar();
    addSearchContent(`https://cn.bing.com/search?q=${searchValue}`);
    // addSearchContent("https://www.baidu.com/s?wd=ssd");

  }
}
// 添加搜索内容
function addSearchContent(url) {
  // 搜索结果框体
  const searchContentBox = document.createElement("span");
  searchContentBox.className = "search-content-box";

  // 顶部
  const searchContentBar = document.createElement("div");
  searchContentBar.className = "search-content-bar";
  move(searchContentBox, searchContentBar);
  // 关闭
  const deleteButton = document.createElement("button");
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

function move(box, moveBar) {
  //元素鼠标按下事件   
  //当鼠标在这个元素身上按下的时候 就会触发回调函数  
  moveBar.onmousedown = function (event) {
    // 获取元素起始位置
    let eleX = box.offsetLeft;
    let eleY = box.offsetTop;
    // 鼠标按下的坐标
    let startX = event.clientX;
    let startY = event.clientY;
    // 解决方案：开启全局捕获
    // 把所有后续的鼠标事件全部强制到这个元素身上，不让事件去处理文字
    moveBar.setCapture && moveBar.setCapture();
    //鼠标抬起事件
    document.onmousemove = throttle(function (event) {
      console.log('移动');
      // 获取鼠标移动后的位置
      let endX = event.clientX;
      let endY = event.clientY;
      // 鼠标距离差 = 鼠标移动后位置 - 鼠标按下的位置
      let disX = endX - startX;
      let disY = endY - startY;
      // 元素最终的位置 = 元素初始位置 + 鼠标距离差
      let lastX = eleX + disX;
      let lastY = eleY + disY;

      // 边界值判断  (吸附效果)
      // 边界值判断逻辑 大于最大值等于最大值 小于最小值等于最小值
      if (lastX > document.documentElement.clientWidth - box.offsetWidth - 20) {
        lastX = document.documentElement.clientWidth - box.offsetWidth;
      } else if (lastX < 20) {
        lastX = 0;
      }
      if (lastY > document.documentElement.clientHeight - box.offsetHeight - 20) {
        lastY = document.documentElement.clientHeight - box.offsetHeight;
      } else if (lastY < 20) {
        lastY = 0;
      }
      // 设置元素移动位置
      box.style.left = lastX + 'px';
      box.style.top = lastY + 'px';
    },30);
    //鼠标抬起事件
    document.onmouseup = function () {
      document.onmousemove = null;
      moveBar.releaseCapture && moveBar.releaseCapture();
    };
    return false;
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
  }
}
console.log("over");






// let searchbar = document.createElement("iframe");
// searchbar.src = chrome.runtime.getURL("../../taojin/searchbar/index.html");
// searchbar.className = "taojin-searchbar";
// searchbar.sandbox = "allow-same-origin allow-scripts allow-modals allow-popups";
// document.body.appendChild(searchbar);