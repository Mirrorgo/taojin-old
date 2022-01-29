import React from "react";
import RichText from "../RichText";
import "./index.css";

export default function Note({ content, itemId, saveItemData }) {
  return (
    <article className="note">
      {/* https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article */}
      <RichText
        content={content}
        saveItemData={saveItemData}
        itemId={itemId}
      ></RichText>
      <span>这是一个用来拖动的图标</span>
    </article>
  );
}
