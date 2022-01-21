//// content-script.js ////
document.body.style.backgroundColor = "orange";
var elem = document.createElement("div");
elem.id = "haorooms";
elem.style = "color: green";
elem.innerHTML = "我是通过content-script创建的测试节点";
// document.body.appendChild(elem);
let firstChild = document.body.firstChild;
document.body.insertBefore(elem, firstChild);
