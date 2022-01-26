import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Text, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";

export default function RTTest2() {
  const editor = useMemo(() => withReact(createEditor()), []); //仅计算一次 memoized 的值
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // 通过 useCallback 定义一个可以记忆的渲染叶子节点的函数
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }
          switch (event.key) {
            case "`":
              event.preventDefault();
              // 确定当前选中的块是否为任意的代码块.
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "code",
              });
              Transforms.setNodes(
                editor,
                // { type: match ? "paragraph" : "code" },
                { type: match ? null : "code" },
                { match: (n) => Editor.isBlock(editor, n) }
              );
              break;

            case "b": {
              event.preventDefault();
              //TODO:再次点击ctrl+B取消加粗的方法?(貌似不能直接套用上面的方案)
              Transforms.setNodes(
                editor,
                { bold: true },
                // 应用到文本节点上，
                // 如果所选内容仅仅是全部文本的一部分，则拆分它们。
                { match: (n) => Text.isText(n), split: true }
              );
              break;
            }
            // default:
            //   //这个需要吗
            //   break;
          }
        }}
      />
    </Slate>
  );
}

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

// Define a React component to render leaves with bold text.
const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};
