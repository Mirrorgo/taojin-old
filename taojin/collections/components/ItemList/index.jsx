import React from "react";
import Note from "../Note";

export default function ItemList({ items }) {
  return items.map((item, index) => (
    <Note
      content={item.content}
      itemId={item.itemId}
      saveItemData={saveItemData}
      key={item.itemId}
    />
  ));
}

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
