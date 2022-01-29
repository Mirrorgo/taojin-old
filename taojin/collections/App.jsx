import React from "react";
import "./App.less";
import { useState } from "react";
import { nanoid } from "nanoid";
import ItemList from "./components/ItemList";
import { ReactComponent as ArrowLeft } from "../../src/icons/arrow-left.svg";
import { ReactComponent as AddNote } from "../../src/icons/add-note.svg";
import { initialUserData } from "./initial-data";

export default function App() {
  if (!localStorage.getItem("taojinUserId1"))
    localStorage.setItem("taojinUserId1", JSON.stringify(initialUserData));
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

  return (
    <div>
      <header>
        <section className="title-bar">
          <button className="more-collections">
            <ArrowLeft />
          </button>
          <input
            className="collection-name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            onBlur={saveCollectionName}
          />
          <button className="add-note" onClick={addNote}>
            <AddNote className="add-note-icon" />
          </button>
        </section>
        <section className="toolbar">
          <button className="add-current-page">Add current page</button>
        </section>
      </header>
      <ItemList items={items}></ItemList>
    </div>
  );
}
