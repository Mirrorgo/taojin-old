import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export default function TestItemList({ items }) {
  return items.map((item, index) => (
    <Wow key={item.itemId} itemId={item.itemId} content={item.content} />
  ));
}

function Wow(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* ... */}
      <div>{props.content} </div>
      <div {...attributes} {...listeners}>
        拖拽组件
      </div>
    </div>
  );
}
