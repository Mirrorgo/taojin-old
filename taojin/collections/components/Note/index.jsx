import React from "react";
import RichText from "../RichText";
import "./index.css";

export default function Note({ content, itemId }) {
  // handleOnChange(JSON.stringify(value));c
  let handleOnChange = (newContent) => {
    // localStorage.setItem("testUserId1".items(where id=itemID), collections);
    //JSON.parse(localStorage.getItem("collectionId1").items) || testValue
    // localStorage.setItem("testUserId1", collections);
    /*  let newCollection = {
      items: [...newContent],
      collectionName: "xxx",
      // order: 1,
    }; */
    //这个handleOnchange确实其他的组件比如site也可以用
    //FIXME:why只留下了最后一个item???✅知道怎么弄了,但不是最优解,频繁读写真的好吗=>仅失去焦点的时候保存;chrome storage不方便在开发的时候实时查看
    //localStorage.setItem("collectionId1".items.(符合id条件的item), JSON.stringify(newCollection));
  };
  return (
    <article className="note">
      {/* https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article */}
      <RichText content={content} handleOnChange={handleOnChange}></RichText>
    </article>
  );
}
