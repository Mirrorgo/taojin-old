import React from "react";
import "./App.css";
import Note from "./components/Note";
import { useState } from "react";
import { nanoid } from "nanoid";
export default function App() {
  let initialValue = testValue;
  if (localStorage.getItem("collectionId1")?.items) {
    initialValue = JSON.parse(localStorage.getItem("collectionId1"))?.items;
    //FIXME:这里需要一层层还原回来,(是否本就支持json?)
  }
  const [items, setItems] = useState(
    // JSON.parse(localStorage.getItem("collectionId1")?.items) || testValue
    initialValue
  );
  // TODO:增加存储功能,传入id到note,note传递个函数到rich text
  // JSON.parse(localStorage.getItem("content")) || initialValue

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
      <h2 className="Group-Name">这是Collections的页面的东西</h2>
      <h3>RichText</h3>
      <button onClick={addNote}>点击添加Note</button>
      <div className="item-list">
        {items.map((item, index) => {
          //if item type为note
          return (
            <Note
              key={item.itemId}
              content={item.content}
              itemId={item.itemId}
            ></Note>
          );
        })}
      </div>
    </div>
  );
}

const testValue = [
  {
    itemId: "qwyieo", //随便编的测试id
    itemType: "Note",
    content: [
      {
        type: "paragraph",
        children: [
          {
            text: "test value",
          },
        ],
      },
    ],
  },
  {
    itemId: "ashahso", //随便编的测试id
    itemType: "Note",
    content: [
      {
        type: "paragraph",
        children: [
          {
            text: "这是一个测试数据",
          },
        ],
      },
    ],
  },
];

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
