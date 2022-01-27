import React from "react";
import "./App.css";
import Note from "./components/Note";
import { useState } from "react";
export default function App() {
  const [items, setItems] = useState([testValue]);
  // TODO:增加存储功能,传入id到note,note传递个函数到rich text
  // JSON.parse(localStorage.getItem("content")) || initialValue
  const addItem = () => {
    const newItems = [...items, testValue];
    setItems(newItems);
  };
  return (
    <div>
      <h2 className="Group-Name">这是Collections的页面的东西</h2>
      <h3>RichText</h3>
      <button onClick={addItem}>点击添加Note</button>
      <div className="item-list">
        {items.map((item, index) => {
          return <Note key={index} item={item}></Note>;
        })}
      </div>
    </div>
  );
}

const testValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "test value",
      },
    ],
  },
];

const initialValue = [
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
