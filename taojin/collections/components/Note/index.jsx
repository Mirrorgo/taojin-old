import React, { useRef } from "react";
import RichText from "../RichText";
import "./index.css";
// ContextMenu组件暂未完成.先留在本地
// import ContextMenu from "../ContextMenu";

import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Note({ content, itemId, saveItemData }) {
  //👇暂时不知道有什么用
  // const animateLayoutChanges = (args) =>
  //   args.isSorting || args.wasDragging
  //     ? defaultAnimateLayoutChanges(args)
  //     : true;
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
    // animateLayoutChanges,
    id: itemId,
  });
  // console.log(CSS.Transform.toString(transform));

  const style = {
    // TODO:保证不同高度的item在排序的时候不变形=>使用下划线
    // transform: CSS.Transform.toString(transform),
    // transition,
    // 往上往下移动的处理不同
    borderTop: `${
      isOver && activeIndex > overIndex ? "2px solid blue" : "2px solid white"
    }`,
    borderBottom: `${
      isOver && activeIndex < overIndex ? "2px solid blue" : "2px solid white"
    }`,
    //TODO:优化isDragging的效果,暂时采用全透明
    // filter: `${isDragging ? "blur(1px)" : "revert"}`,
    opacity: `${isDragging ? ".0" : "revert"}`,
    //FIXME:cursor在isOver,isSorting和isDragging下都未生效
    // cursor: `${isOver ? "cell" : ""}`,
    // cursor: `${isOver ? "text" : "cell"}`,
  };
  const noteRef = useRef(null);
  return (
    <article className="note" ref={setNodeRef} style={style}>
      {/* 仅仅是用来获取ref给自定义的右键菜单 */}
      <div ref={noteRef}>
        <RichText
          content={content}
          saveItemData={saveItemData}
          itemId={itemId}
        ></RichText>
        <span
          {...attributes}
          {...listeners}
          style={{
            // FIXME:cursor在isOver,isSorting和isDragging下都未生效
            // cursor: `${isOver ? "grab" : "cell"}`,
            cursor: "grab",
          }}
        >
          这是一个用来拖动的图标
        </span>
        {/* TODO:将👆span去掉,让RichText在单击之后才会进入编辑界面,否则可以直接拖动 */}
      </div>
      {/* <ContextMenu menu={<CustomMenu />} targetRef={noteRef} /> */}
    </article>
  );
}

const CustomMenu = () => (
  <ul className="menu">
    <li>Login</li>
    <li>Register</li>
    <li>Open Profile</li>
  </ul>
);
