import React from "react";
import RichText from "../RichText";
import "./index.css";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Note({ content, itemId, saveItemData }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: itemId });

  const style = {
    // TODO:保证不同高度的item在排序的时候不变形
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <article className="note" ref={setNodeRef} style={style}>
      {/* https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article */}
      <RichText
        content={content}
        saveItemData={saveItemData}
        itemId={itemId}
      ></RichText>
      <span {...attributes} {...listeners}>
        这是一个用来拖动的图标
      </span>
      {/* TODO:将👆span去掉,让RichText在单击之后才会进入编辑界面,否则可以直接拖动 */}
    </article>
  );
}
