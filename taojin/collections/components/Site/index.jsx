import React, { useRef } from "react";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { ReactComponent as Drag } from "../../../../src/icons/drag.svg";
import { ReactComponent as Delete } from "../../../../src/icons/delete.svg";
import "./index.less";

export default function Site({ content, itemId, saveItemData, deleteItem }) {
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
    id: itemId,
  });

  const style = {
    // TODO:保证不同高度的item在排序的时候不变形=>使用下划线✅=>之后尝试transform的方法,但是目前改不动了
    // transform: CSS.Transform.toString(transform),
    // transition,
    // 往上往下移动的处理不同
    borderTop: `${
      isOver && activeIndex > overIndex ? "2px solid blue" : "2px solid #f7f7f7"
    }`,
    borderBottom: `${
      isOver && activeIndex < overIndex ? "2px solid blue" : "2px solid #f7f7f7"
    }`,
    //TODO:优化isDragging的效果,暂时采用全透明
    // filter: `${isDragging ? "blur(1px)" : "revert"}`,
    opacity: `${isDragging ? ".0" : "revert"}`,
    //FIXME:cursor在isOver,isSorting和isDragging下都未生效
    // cursor: `${isOver ? "cell" : ""}`,
    // cursor: `${isOver ? "text" : "cell"}`,
  };
  const noteRef = useRef(null);
  console.log(content);
  return (
    <article className="site" ref={setNodeRef} style={style}>
      <div>
        <div>
          <a
            className="siteTitle"
            href={content.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.siteTitle}
          </a>
          <div>
            <img src="" alt="siteIcon" />
            <span>{content.siteOrigin}</span>
          </div>
        </div>
        <img src="" alt="nothing" />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <span
          // FIXME:cursor在isOver,isSorting和isDragging下都未生效
          // cursor: `${isOver ? "grab" : "cell"}`,
          {...attributes}
          {...listeners}
          style={{ cursor: "grab" }}
        >
          <Drag />
        </span>
        <button
          onClick={() => deleteItem(itemId)}
          style={{ backgroundColor: "transparent", borderStyle: "none" }}
        >
          <Delete />
        </button>
      </div>
    </article>
  );
}
