import React, { useMemo, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import "./index.css";

export default function RichText() {
  // 创建一个不会在渲染中变化的 Slate 编辑器对象。
  const editor = useMemo(() => withReact(createEditor()), []);
  //跟踪编辑器中value的值
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);
  return (
    <div>
      <h3>RichText</h3>
      {/* <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)} /> */}
      <div className="editor">
        <Slate
          editor={editor}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Editable
            // 定义一个新的处理程序在控制台打印按下的键
            onKeyDown={(event) => {
              console.log(event.key);
            }}
          />
        </Slate>
      </div>
    </div>
  );
}
