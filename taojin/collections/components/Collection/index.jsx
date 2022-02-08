import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import "./index.less";
import { ReactComponent as Delete } from "../../../../src/icons/delete.svg";

export default function Collection({ collectionId, deleteItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isSorting,
    isOver,
    isDragging,
    activeIndex,
    overIndex,
  } = useSortable({
    id: collectionId,
  });
  let collection = { collectionName: "" };
  collection = localStorage.getItem(collectionId)
    ? JSON.parse(localStorage.getItem(collectionId))
    : console.log("无法根据这个itemId获取到东西");
  console.log(collection);
  return (
    <article className="collectionList">
      <div className="collection-name">{collection.collectionName}</div>
      <div className="bottom-bar">
        <span className="collection-item-number">
          {collection.itemIds.length} items
        </span>
        <button
          className="delete-button"
          onClick={() => deleteItem(collectionId)}
          style={{ backgroundColor: "transparent", borderStyle: "none" }}
        >
          <Delete />
        </button>
      </div>
    </article>
  );
}
