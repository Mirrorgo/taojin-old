import React from "react";
import "./App.less";
import { useState } from "react";
import { nanoid } from "nanoid";
import ItemList from "./components/ItemList";
import { ReactComponent as ArrowLeft } from "../../src/icons/arrow-left.svg";
import { ReactComponent as AddNote } from "../../src/icons/add-note.svg";
import { initialUserData } from "./initial-data";

export default function App() {
  //没有缓存的情况下,对浏览器内数据初始化
  if (!localStorage.getItem("taojinUserId1"))
    localStorage.setItem("taojinUserId1", JSON.stringify(initialUserData));
  //获取浏览器内缓存的数据
  const initialAppData = JSON.parse(localStorage.getItem("taojinUserId1"))
    .userCollections[0]; //先只弄一个collection的情况
  const [items, setItems] = useState(initialAppData.items);
  const [collectionName, setCollectionName] = useState(
    initialAppData.collectionName
    // "这是collection的测试名称"
  );
  const addNote = () => {
    const newKey = nanoid(); //生成一个随机的key
    const newItems = [
      ...items,
      {
        itemId: newKey,
        itemType: "Note",
        content: [
          {
            type: "paragraph",
            children: [
              {
                text: "newNote",
              },
            ],
          },
        ],
      },
    ];
    setItems(newItems);
  };
  const saveCollectionName = () => {
    let previousUserData = JSON.parse(localStorage.getItem("taojinUserId1"));
    let newUserData = {
      userName: "taojinUser1",
      userCollections: [
        {
          ...previousUserData.userCollections[0],
          collectionName: collectionName,
        },
      ],
    };
    localStorage.setItem("taojinUserId1", JSON.stringify(newUserData));
  };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    //参考👉 https://codesandbox.io/s/k260nyxq9v?file=/index.js
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1); //sourceIndex的内容移除并且将移除的内容放入removed
    result.splice(endIndex, 0, removed); //把removed插入destinationIndex处
    return result;
  };

  const reorderItemData = (reorderedItems) => {
    let newUserData = {
      userName: "taojinUser1",
      userCollections: [
        {
          collectionId: "sauqhwiqiu2s",
          items: reorderedItems,
          collectionName: collectionName,
          //review:[一个类似上面content的结构,可用于RichText]
        },
      ],
    };
    localStorage.setItem("taojinUserId1", JSON.stringify(newUserData));
  };

  const onDragEnd = (result) => {
    //拖动结束后的处理函数
    if (!result.destination) {
      return;
    }
    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(reorderedItems);
    reorderItemData(
      //持久化reorder的结果
      reorderedItems
    );
  };

  return (
    <div>
      <section className="toolbar">
        <button className="more-collections">
          <ArrowLeft />
        </button>
        <input
          className="collection-name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          onBlur={saveCollectionName}
        />
        <button className="add-current-page">Add current page</button>
        <button className="add-note" onClick={addNote}>
          <AddNote className="add-note-icon" />
        </button>
      </section>
      <section className="column">
        <ItemList items={items}></ItemList>
      </section>
    </div>
  );
}
