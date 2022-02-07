import React from "react";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  arrayMove, //官方提供的reorder函数,暂未使用
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CollectionList from "../CollectionList";
import "./index.less";
import { useImmer } from "use-immer";
import { initialUserData } from "../../initial-data";

export default function Aside() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // const [collections, setCollections] = useState(
  //   JSON.parse(localStorage.getItem("taojinUserId1")).userCollections
  // );

  const [user, setUser] = useImmer(initialUserData);

  return (
    <aside className="left-panel">
      <header className="title">
        <div>Collections</div>
      </header>
      <button className="add-new-collection">Add new collection</button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <article className="column">
          <SortableContext
            items={collections.map((i) => i.collectionId)} //参考了👉提供的解决方案https://codesandbox.io/s/wnxzo?file=/src/App.jsx:656-680
            strategy={verticalListSortingStrategy}
          >
            <CollectionList items={collections}></CollectionList>
          </SortableContext>
        </article>
      </DndContext>
    </aside>
  );
}
const handleDragEnd = () => {
  console("handleDragEnd");
};
const deleteItem = () => {
  console.log();
};
