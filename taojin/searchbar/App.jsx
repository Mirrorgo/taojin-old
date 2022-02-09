import React, { useEffect, useRef, useState } from "react";
import SearchContent from "./components/SearchContent";


function App() {
  function go() {
    console.log("go")
    window.postMessage({requestUrl:"https://www.baidu.com/s?wd=1&tn=json"},"*");
  }
  return (
    <>
      <button className=" bg-white" onClick={go}>gogogo</button>
    </>
  );
}
export default App;
