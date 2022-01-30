import React from "react";
import Note from "../Note";
import { Droppable, Draggable } from "react-beautiful-dnd";

export default function ItemList({ items }) {
  {
    /* droppable需要一个id,目前直接用的collectionId */
  }
  return (
    <Droppable
      droppableId="sauqhwiqiu2s"
      className="item-list"
      key="sauqhwiqiu2s"
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={{
            backgroundColor: snapshot.isDragging ? "green" : "lightblue",
          }}
          {...provided.droppableProps}
        >
          {/* only re-render if the students array reference changes */}
          {/* TODO */}
          <InnerList items={items} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

const InnerList = React.memo(function InnerList({ items }) {
  return items.map((item, index) => (
    //需要有个key
    <Draggable draggableId={item.itemId} index={index} key={item.itemId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps} //draggableProps移到哪,哪里是可拖动的点
          {...provided.dragHandleProps}
        >
          <Note
            content={item.content}
            itemId={item.itemId}
            saveItemData={saveItemData}
          />
          {/* <div>hello</div> */}
        </div>
      )}
    </Draggable>
  ));
});

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
        //review:[一个类似上面content的结构,可用于RichText]
      },
    ],
  };
  localStorage.setItem("taojinUserId1", JSON.stringify(newUserData));
};
