import React from "react";
import "./App.css";
import Note from "./components/Note";
import { useState } from "react";
import { nanoid } from "nanoid";

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
              saveItemData={saveItemData}
            ></Note>
          );
        })}
      </div>
    </div>
  );
}

const saveItemData = (itemId, itemType, newContent) => {
  let previousUserData = JSON.parse(localStorage.getItem("taojinUserId1"));
  let has = false;
  let newItems = previousUserData.userCollections[0].items.map((item) => {
    if (item.itemId === itemId) {
      has = true;
      return { ...item, content: newContent };
    }
    return item;
  });
  if (!has)
    newItems = [
      ...previousUserData.userCollections[0].items,
      { itemId: itemId, itemType: itemType, content: newContent },
    ];
  let newUserData = {
    userName: "taojinUser1",
    userCollections: [
      {
        collectionId: "sauqhwiqiu2s",
        items: newItems,
        collectionName: "xxx",
        order: 1,
        //review:[一个类似上面content的结构,可用于RichText]
      },
    ],
  };
  localStorage.setItem("taojinUserId1", JSON.stringify(newUserData));
};

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
