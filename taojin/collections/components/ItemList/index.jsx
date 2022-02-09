import React, { useLayoutEffect } from "react";
import Note from "../Note";
import { useEffect } from "react";

export default function ItemList({
  itemIds,
  deleteItem,
  saveItemData,
  activeCollectionFullData,
}) {
  return itemIds.map((itemId) => (
    <Item
      itemId={itemId}
      key={itemId}
      activeCollectionFullData={activeCollectionFullData}
      deleteItem={deleteItem}
      saveItemData={saveItemData}
    ></Item>
  ));
}

const Item = ({
  itemId,
  deleteItem,
  saveItemData,
  activeCollectionFullData,
}) => {
  // let item = { itemType: "?", content: [] }; //不写{}里的会出问题?
  //FIXME:👇貌似不太行,怎么样获取数据比较合理?
  let item = localStorage.getItem(itemId)
    ? JSON.parse(localStorage.getItem(itemId))
    : { itemType: "" };//得给个凑数的,不然删除的时候会报错

  //先暂时这么写
  switch (item.itemType) {
    case "note":
      return (
        <Note
          content={item.content}
          itemId={itemId}
          saveItemData={saveItemData}
          deleteItem={deleteItem}
        />
      );
    case "site":
      return <div>这是个site</div>;
    default:
      return (
        <article>
          <h1>这是什么类型?你是不是弄错了itemType</h1>
          <div>你输入的itemType是{item.itemType}</div>
        </article>
      );
  }
};
