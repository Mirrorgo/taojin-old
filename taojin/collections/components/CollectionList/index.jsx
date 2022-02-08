import React from "react";
import Collection from "../Collection";

export default function CollectionList({ itemIds, deleteItem }) {
  //STAR:这里的itemIds其实是collectionIds,这里这样做是为了之后方便提取复用的组件
  return itemIds.map((collectionId) => (
    <Collection
      collectionId={collectionId}
      key={collectionId}
      deleteItem={deleteItem}
    ></Collection>
  ));
}
