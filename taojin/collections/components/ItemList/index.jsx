import React from "react";
import Note from "../Note";

export default function ItemList({ items }) {
  return items.map((item, index) => (
    <Item item={item} key={item.itemId}></Item>
  ));
}

const Item = ({ item }) => {
  switch (item.itemType) {
    case "note":
      return (
        <Note
          content={item.content}
          itemId={item.itemId}
          saveItemData={saveItemData}
        />
      );
    case "site":
      return <div>这是个site</div>;
    default:
      return (
        <article>
          <h1>这是什么类型?你是不弄错了itemType</h1>
          <div>你输入的itemType是{item.itemType}</div>
        </article>
      );
  }
};

const saveItemData = (itemId, itemType, newContent) => {
  let previousUserData = JSON.parse(localStorage.getItem("taojinUserId1"));
  let has = false;
  let { collectionName } = previousUserData.userCollections[0];
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
        collectionName: collectionName,
      },
    ],
  };
  localStorage.setItem("taojinUserId1", JSON.stringify(newUserData));
};
