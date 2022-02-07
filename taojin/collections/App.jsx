import React, { useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import "./App.less";
import { nanoid } from "nanoid";
import ItemList from "./components/ItemList";
import Aside from "./components/Aside";
import { ReactComponent as ArrowLeft } from "../../src/icons/arrow-left.svg";
import { ReactComponent as AddNote } from "../../src/icons/add-note.svg";
import {
  initialUserData,
  initialCollectionData,
  initialNoteData,
} from "./initial-data";

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
import { useImmer } from "use-immer";
export default function App() {
  const [user, setUser] = useImmer({});
  const [collection, setCollection] = useImmer({
    collectionName: "",
    itemIds: [],
  });
  //DndContext所需的Sensor
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  //获取浏览器内缓存的数据
  let initialUser;
  useEffect(() => {
    //没有缓存的情况下,对浏览器内UserData初始化✅
    if (!localStorage.getItem("taojinUserId1"))
      localStorage.setItem("taojinUserId1", JSON.stringify(initialUserData));
    //获取浏览器内缓存的数据
    initialUser = JSON.parse(localStorage.getItem("taojinUserId1"));
    setUser(initialUser);
    //根据缓存的UserData的activeCollection初始化collectionData
    if (!localStorage.getItem(initialUser.userActiveCollection)) {
      localStorage.setItem(
        initialUser.userActiveCollection,
        JSON.stringify(initialCollectionData)
      );
    }
    const initialCollection = JSON.parse(
      localStorage.getItem(initialUser.userActiveCollection)
    );
    setCollection(initialCollection);
  }, []);
  useEffect(() => {
    //监听collection,实时保存
    if (user.userActiveCollection)
      localStorage.setItem(
        user.userActiveCollection,
        JSON.stringify(collection)
      );
  }, [collection]);

  const handleAddNote = useCallback(() => {
    //✅
    const newId = nanoid();
    setCollection((draft) => {
      draft.itemIds.push(newId);
    });
    //NOTE:此处已经新建了个note在localStorage,但collection没有新建
    localStorage.setItem(newId, JSON.stringify(initialNoteData)); //这个是否要放入useEffect?怎么放?
  }, []);

  const handleDeleteItem = (itemId) => {
    localStorage.removeItem(itemId);
    const deleteIndex = collection.itemIds.findIndex((cur) => cur === itemId);
    setCollection((draft) => {
      draft.itemIds.splice(deleteIndex, 1);
    });
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
  //NOTE:cly的部分
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
  };
  const handleDragEnd = (event) => {
    const { active, over } = event; //active:被拖动的元素,over:在active下方的元素
    if (active.id !== over.id) {
      const oldIndex = collection.itemIds.findIndex((i) => i === active.id);
      const newIndex = collection.itemIds.findIndex((i) => i === over.id);
      const reorderedItemIds = reorder(collection.itemIds, oldIndex, newIndex);
      setCollection((draft) => {
        draft.itemIds = reorderedItemIds;
      });
    }
  };
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1); //sourceIndex的内容移除并且将移除的内容放入removed
    result.splice(endIndex, 0, removed); //把removed插入destinationIndex处
    return result;
  };
  const saveItemData = (itemId, itemType, newContent) => {
    setCollection((draft) => {
      //之后这个采用Map结构优化itemIds
      if (!draft.itemIds.includes(itemId)) draft.itemIds.push(itemId);
    });
    const newItem = { itemType: itemType, content: newContent };
    localStorage.setItem(itemId, JSON.stringify(newItem));
  };
  //TODO:weakMap优化数据结构

  return (
    <div className="all">
      {/* <Aside></Aside> */}
      <main className="main">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <section className="toolbar">
            <button className="more-collections">
              <ArrowLeft />
            </button>
            <input
              className="collection-name"
              value={collection.collectionName}
              onChange={(e) =>
                setCollection((draft) => {
                  draft.collectionName = e.target.value;
                })
              }
            />
            <button className="add-current-page" onClick={addSite}>
              Add current page
            </button>
            <button className="add-note" onClick={handleAddNote}>
              <AddNote className="add-note-icon" />
            </button>
          </section>
          <article className="column">
            <SortableContext
              items={collection.itemIds} //参考了👉提供的解决方案https://codesandbox.io/s/wnxzo?file=/src/App.jsx:656-680
              strategy={verticalListSortingStrategy}
            >
              <ItemList
                itemIds={collection.itemIds}
                deleteItem={handleDeleteItem}
                saveItemData={saveItemData}
              ></ItemList>
            </SortableContext>
          </article>
        </DndContext>
      </main>
    </div>
  );
}
