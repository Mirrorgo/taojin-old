import React from "react";
import Note from "../Note";

export default function ItemList({ items }) {
  return (
    <main className="item-list">
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
    </main>
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
