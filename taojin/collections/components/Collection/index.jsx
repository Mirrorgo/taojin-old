import React, { useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import "./index.less";
import { ReactComponent as Delete } from "../../../../src/icons/delete.svg";

export default function Collection({
  collectionId,
  deleteItem,
  activeCollectionFullData,
  handleSwitchCollection,
}) {
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
  let isActiveCollection =
    activeCollectionFullData.activeCollectionId === collectionId ? true : false;
  collection = localStorage.getItem(collectionId)
    ? JSON.parse(localStorage.getItem(collectionId))
    : console.log("无法根据这个itemId获取到东西");
  useEffect(() => {
    //FIXME:一个临时解决方案
    if (activeCollectionFullData.activeCollectionId === collectionId) {
      collection = localStorage.getItem(collectionId)
        ? JSON.parse(localStorage.getItem(collectionId))
        : console.log("无法根据这个itemId获取到东西");
    }
  }, [activeCollectionFullData]);

  return (
    <article
      className="collection"
      style={{
        backgroundColor: `${isActiveCollection ? "#abc0f1" : "#dedeec"}`,
      }}
      onClick={() => handleSwitchCollection(collectionId)}
    >
      <div className="collection-name">{collection.collectionName}</div>
      <div className="bottom-bar">
        <span className="collection-item-number">
          {collection.itemIds.length} items
        </span>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation(); //阻止事件冒泡
            return deleteItem(collectionId);
          }}
          style={{ backgroundColor: "transparent", borderStyle: "none" }}
        >
          <Delete />
        </button>
      </div>
    </article>
  );
}
