import React, { useCallback, useMemo, useState } from "react";
import {
  Editor,
  Transforms,
  Range,
  Point, //引用 Slate 文档中文本节点中的特定位置。 它的路径是指节点在树中的位置，其偏移量是指到节点文本字符串的距离。点只能引用 Text (文本)
  createEditor,
  Element as SlateElement,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  ReactEditor,
  useSelected,
  useFocused,
} from "slate-react";
import { withHistory } from "slate-history";

import isUrl from "is-url";

import "./index.less";

const SHORTCUTS = {
  "*": "list-item",
  "-": "list-item",
  "+": "list-item",
  ">": "block-quote",
  "#": "heading-one",
  "##": "heading-two",
  "###": "heading-three",
  "####": "heading-four",
  "#####": "heading-five",
  "######": "heading-six",
  //TODO:
  //```代码块
  //ctrl+/激活各种拓展操作
  // /拓展操作
};
// STAR:RTTest都是网上找的demo仅用于测试
// TODO:list-item需要增加tab&shiftTab调整缩进的方式
// 各级标题再次输入同一shortcut变普通文本
// 代码块中的内容一键复制
// FIXME:slate中tab无效的问题(会丢失焦点)
// FIXME:此文件奇数次保存会白屏报错,根据github issue,为slate.js的问题
// 大型组件连续保存导致vite频繁热更新会导致vscode闪退=>解决方案:降低保存频率(疑似vite的性能问题)

export default function RichText({ content, saveItemData, itemId }) {
  const [value, setValue] = useState(
    // JSON.parse(localStorage.getItem("content")) || initialValue
    content
    // chrome.storage.sync.get("content", function (result) {
    //   console.log("Value currently is " + result.key);
    // })
  );
  const renderElement = useCallback((props) => <Element {...props} />, []);
  // 创建一个不会在渲染中变化的 Slate 编辑器对象
  const editor = useMemo(
    () => withImages(withShortcuts(withReact(withHistory(createEditor())))),
    []
  ); //useMemo传入空数组代表仅计算一次 memoized 的值,也就是初始化的时候
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        setValue(value);
      }}
    >
      <Editable
        className="slate"
        renderElement={renderElement}
        placeholder="这里可以写markdown"
        onBlur={saveItemData(itemId, "note", value)}
      />
    </Slate>
  );
}
/* const withImages = (editor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };
  return editor;
}; */

const withImages = (editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor, url) => {
  const text = { text: "" };
  const image = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

const withShortcuts = (editor) => {
  const { deleteBackward, insertText } = editor;
  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === " " && selection && Range.isCollapsed(selection)) {
      //Range.isCollapsed:返回一个Range(拖蓝)是否为0的Boolean
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const type = SHORTCUTS[beforeText];

      if (type) {
        Transforms.select(editor, range); //将选区 selection设置为target指定的新值
        Transforms.delete(editor);
        const newProperties = {
          type,
        };
        Transforms.setNodes(editor, newProperties, {
          match: (n) => Editor.isBlock(editor, n),
        });

        if (type === "list-item") {
          const list = {
            type: "bulleted-list",
            children: [],
          };
          Transforms.wrapNodes(editor, list, {
            match: (n) =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === "list-item",
          });
        }

        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== "paragraph" &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties = {
            type: "paragraph",
          };
          Transforms.setNodes(editor, newProperties);

          if (block.type === "list-item") {
            Transforms.unwrapNodes(editor, {
              match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === "bulleted-list",
              split: true,
            });
          }
          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
};

// STAR:此处各级字体大小&行高采用的是tailwind css前六级字体的大小 👉 https://www.tailwindcss.cn/docs/font-size
//语雀方案:
//1.2.3.4级字体逐级减小,4级为16px(加粗);5级为15px(加粗);6级为15px(不加粗),与正文相同
//So,参考语雀方案改动,123456逐级减小,均加粗,其余内容默认字号与6级字体相同
const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          className="block-quote"
          style={{
            fontSize: ".75rem",
            lineHeight: "1rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul
          style={{
            fontSize: ".75rem",
            lineHeight: "1rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1
          style={{
            fontSize: "1.5rem",
            lineHeight: "2rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2
          style={{
            fontSize: "1.25rem",
            lineHeight: "1.75rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3
          style={{
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4
          style={{
            fontSize: "1rem",
            lineHeight: "1.5rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5
          style={{
            fontSize: ".875rem",
            lineHeight: "1.25rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6
          style={{
            fontSize: ".75rem",
            lineHeight: "1rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </h6>
      );
    case "list-item":
      return (
        <li
          style={{
            fontSize: ".75rem",
            lineHeight: "1rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </li>
      );
    case "image":
      return <Image {...props} />;
    default:
      return (
        <p
          style={{
            fontSize: ".75rem",
            lineHeight: "1rem",
            marginTop: ".3em",
            marginBottom: ".3em",
          }}
          {...attributes}
        >
          {children}
        </p>
      );
  }
};

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false}>
        <img
          className={`${selected && focused ? "selectedImage" : "Image"}`}
          src={element.url}
        />
      </div>
    </div>
  );
};

const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};
