import React from "react";
import html2canvas from "html2canvas";
import "./App.less";
import { useState } from "react";
import { nanoid } from "nanoid";
import ItemList from "./components/ItemList";
import { ReactComponent as ArrowLeft } from "../../src/icons/arrow-left.svg";
import { ReactComponent as AddNote } from "../../src/icons/add-note.svg";
import { initialUserData } from "./initial-data";

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

export default function App() {
  //没有缓存的情况下,对浏览器内数据初始化
  if (!localStorage.getItem("taojinUserId1"))
    localStorage.setItem("taojinUserId1", JSON.stringify(initialUserData));
  //获取浏览器内缓存的数据
  const initialAppData = JSON.parse(localStorage.getItem("taojinUserId1"))
    .userCollections[0]; //先只弄一个collection的情况
  const [items, setItems] = useState(initialAppData.items);
  const [collectionName, setCollectionName] = useState(
    initialAppData.collectionName
    // "这是collection的测试名称"
  );
  const addNote = () => {
    const newKey = nanoid(); //生成一个随机的key
    const newItems = [
      ...items,
      {
        itemId: newKey,
        itemType: "note",
        content: [
          {
            type: "paragraph",
            children: [
              {
                text: "newNote",
              },
            ],
          },
        ],
      },
    ];
    setItems(newItems);
  };
  const saveCollectionName = () => {
    let previousUserData = JSON.parse(localStorage.getItem("taojinUserId1"));
    let newUserData = {
      userName: "taojinUser1",
      userCollections: [
        {
          ...previousUserData.userCollections[0],
          collectionName: collectionName,
        },
      ],
    };
    localStorage.setItem("taojinUserId1", JSON.stringify(newUserData));
  };
  // 👇内容为原beautiful-dnd的onDragEnd函数,dnd-kit官方有提供,但后续可以自己尝试官方的写法
  /* // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    //参考👉 https://codesandbox.io/s/k260nyxq9v?file=/index.js
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1); //sourceIndex的内容移除并且将移除的内容放入removed
    result.splice(endIndex, 0, removed); //把removed插入destinationIndex处
    return result;
  };

  const reorderItemData = (reorderedItems) => {
    let newUserData = {
      userName: "taojinUser1",
      userCollections: [
        {
          collectionId: "sauqhwiqiu2s",
          items: reorderedItems,
          collectionName: collectionName,
          //review:[一个类似上面content的结构,可用于RichText]
        },
      ],
    };
    localStorage.setItem("taojinUserId1", JSON.stringify(newUserData));
  };

  const onDragEnd = (result) => {
    //拖动结束后的处理函数
    if (!result.destination) {
      return;
    }
    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(reorderedItems);
    reorderItemData(
      //持久化reorder的结果
      reorderedItems
    );
  }; */
  const saveReorderedItems = (reorderedItems) => {
    //持久化reorder的结果
    let newUserData = {
      userName: "taojinUser1",
      userCollections: [
        {
          collectionId: "sauqhwiqiu2s",
          items: reorderedItems,
          collectionName: collectionName,
        },
      ],
    };
    localStorage.setItem("taojinUserId1", JSON.stringify(newUserData));
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1); //sourceIndex的内容移除并且将移除的内容放入removed
    result.splice(endIndex, 0, removed); //把removed插入destinationIndex处
    return result;
  };

  const addSite = () => {
    const newKey = nanoid(); //生成一个随机的key
    let content = {};
    content.siteTitle = document.title;
    content.siteOrigin = location.origin;
    content.hostName = location.hostname;
    let scroll_top = 0; // 获取滚动高度
    if (document.documentElement && document.documentElement.scrollTop) {
      scroll_top = document.documentElement.scrollTop;
    } else if (document.body) {
      scroll_top = document.body.scrollTop;
    }
    //  截图当前网页窗口
    html2canvas(document.querySelector("body"), {
      y: scroll_top,
      width: window.innerWidth,
      height: window.innerHeight,
    }).then((canvas) => {
      content.siteImg = canvas.toDataURL("image/png", 0.2);
      // let imgElement = document.createElement('img')
      // imgElement.src = canvas.toDataURL("image/png", 0.5);  // 将网页转成base64字符编码，0.5为图片质量
      // document.body.appendChild(imgElement)   // 我直接插个dom看效果
    });
    console.log(content);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event; //active:被拖动的元素,over:在active下方的元素
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.itemId === active.id);
      const newIndex = items.findIndex((i) => i.itemId === over.id);
      const reorderedItems = reorder(items, oldIndex, newIndex);
      setItems(reorderedItems);
      saveReorderedItems(reorderedItems);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // const measuringConfig = {
  //   droppable: {
  //     strategy: MeasuringStrategy.Always,
  //   },
  // };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      // measuring={measuringConfig}
    >
      <section className="toolbar">
        <button className="more-collections">
          <ArrowLeft />
        </button>
        <input
          className="collection-name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          onBlur={saveCollectionName}
        />
        <button className="add-current-page" onClick={addSite}>
          Add current page
        </button>
        <button className="add-note" onClick={addNote}>
          <AddNote className="add-note-icon" />
          {/* <ContextMenu menu={<CustomMenu />} /> */}
        </button>
      </section>
      <article className="column">
        <SortableContext
          items={items.map((i) => i.itemId)} //参考了👉提供的解决方案https://codesandbox.io/s/wnxzo?file=/src/App.jsx:656-680
          strategy={verticalListSortingStrategy}
        >
          <ItemList items={items}></ItemList>
        </SortableContext>
      </article>
    </DndContext>
  );
}
