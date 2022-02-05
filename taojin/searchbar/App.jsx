import React, { useEffect, useState } from "react";
import SearchContent from "./components/SearchContent";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [searchContents, setSearchContents] = useState([]);
  useEffect(() => {
    document.addEventListener('keyup', addSearchBar);
    return document.removeEventListener('keyup', addSearchBar);
  })
  async function getSearchResult() {
    // const result = await fetch(`https://cn.bing.com/search?q=${searchValue}`);
    // console.log(result);

    // window.open(`https://cn.bing.com/search?q=${searchValue}`);
    // const searchbar = document.querySelector("#taojin-searchbar");
    // window.open(`https://cn.bing.com/search?q=${searchValue}`);
    // const beforeEl =  parent.document.querySelector(".search-content");
    // if (beforeEl) {
    //   beforeEl.remove();
    // }
    // console.log(1);
    const searchContent = document.createElement("iframe");
    searchContent.src = `https://cn.bing.com/search?q=${searchValue}`;
    searchContent.className = "search-content";
    searchContent.sandbox = "allow-same-origin allow-scripts allow-modals allow-popups";
    console.log(2);
    console.log(searchContent.src);
    document.body.append(searchContent);
  }
  function search(e) {
    if (e.key === "Enter" && searchValue) {
      console.log(searchValue);
      setShowSearchBar(false);
      setSearchContents(pre => [...pre, `https://cn.bing.com/search?q=${searchValue}`]);
    }
  }
  function addSearchBar(e) {
    if ('q' === e.key && e.ctrlKey) {
      setShowSearchBar(pre => !pre);
    }
  }
  return (
    <>
      {!showSearchBar || <div id="search-bar" className="absolute text-2xl p-2 border-2 top-1/3 left-1/2">
        <input className="focus:outline-none" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="搜索网页" onKeyUp={search}></input>
      </div>}
      {searchContents.map(url =>
        <SearchContent url={url}></SearchContent>
      )}
    </>
  );
}
export default App;
