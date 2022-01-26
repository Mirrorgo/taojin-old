import React from "react";
import RichText from "../RichText";
import "./index.css";

export default function Note() {
  return (
    <article className="note">
      {/* https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article */}
      <RichText></RichText>
    </article>
  );
}
