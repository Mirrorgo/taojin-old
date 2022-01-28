import React from "react";
import "./App.less";
import { useState } from "react";
import { nanoid } from "nanoid";
import ItemList from "./components/ItemList";
import "virtual:svg-icons-register"; //引入svg
const initialUserData = {
  userName: "taojinUser1",
  userCollections: [
    {
      collectionId: "sauqhwiqiu2s",
      items: [],
      collectionName: "xxx",
      order: 1,
      //review:[一个类似上面content的结构,可用于RichText]
    },
  ],
};

export default function App() {
  if (!localStorage.getItem("taojinUserId1"))
    localStorage.setItem("taojinUserId1", JSON.stringify(initialUserData));
  const initialAppData = JSON.parse(localStorage.getItem("taojinUserId1"))
    .userCollections[0].items; //先只弄一个collection的情况
  const [items, setItems] = useState(initialAppData);
  const addNote = () => {
    const newKey = nanoid();
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
  return (
    <div>
      <header>
        <section className="title-bar">
          <button className="more-collections">👈</button>
          <h1 className="collection-name">这是Collections的页面的东西</h1>
          <button className="add-note" onClick={addNote}>
            add Note
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

const richTextDataSet1 = [
  //暂不使用,仅用于表示RichText的数据结构
  {
    type: "paragraph",
    children: [
      {
        text: 'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
      },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: 'Order when you start a line with "## " you get a level-two heading, like this:',
      },
    ],
  },
  {
    type: "heading-two",
    children: [{ text: "Try it out!" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: 'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
      },
    ],
  },
];
