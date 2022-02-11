import React, { useCallback, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { nanoid } from "nanoid";
import ItemList from "../../components/ItemList";
import CollectionList from "../../components/CollectionList";
import { ReactComponent as ArrowLeft } from "../../../../src/icons/arrow-left.svg";
import { ReactComponent as AddNote } from "../../../../src/icons/add-note.svg";
import {
  initialUserData,
  initialCollectionData,
  initialNoteData,
} from "../../initial-data";
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
import "./index.less";
export default function Main() {
  const [user, setUser] = useImmer({
    userName: "taojinUser1",
    userCollections: [],
    userActiveCollection: "",
  });
  const [collection, setCollection] = useImmer({
    collectionName: "",
    itemIds: [],
  });
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  /* =========================== */
  // FIXME:一个临时的解决方案👇
  // 问题来源:setState为异步,localStorage为同步,导致总会慢一步
  const [activeCollectionFullData, setActiveCollectionFullData] = useImmer({
    activeCollectionId: "",
    activeCollectionName: "",
    activeCollectionItemIdsLength: undefined,
  });
  useEffect(() => {
    setActiveCollectionFullData((draft) => {
      draft.activeCollectionId = user.userActiveCollection;
    });
    // console.log(user.userActiveCollection,'当前');
  }, [user.userActiveCollection]);
  useEffect(() => {
    setActiveCollectionFullData((draft) => {
      draft.activeCollectionName = collection.collectionName;
    });
  }, [collection.collectionName]);
  useEffect(() => {
    setActiveCollectionFullData((draft) => {
      draft.activeCollectionItemIdsLength = collection.itemIds.length;
    });
  }, [collection.itemIds.length]);
  //👆记得替换掉这个临时的解决方案,让无localStorage的时候也能流畅的跑
  /* ============================ */
  useEffect(() => {
    if (!user.userActiveCollection) {
      setCollection({ collectionName: "", itemIds: [] });
    } else {
      setCollection(
        JSON.parse(localStorage.getItem(user.userActiveCollection))
      );
    }
  }, [user.userActiveCollection]);

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
    if (initialUser.userActiveCollection) {
      let initialCollection = JSON.parse(
        localStorage.getItem(initialUser.userActiveCollection)
      );
      setCollection(initialCollection);
    }
  }, []);
  useEffect(() => {
    //监听collection,实时保存
    if (user.userActiveCollection)
      localStorage.setItem(
        user.userActiveCollection,
        JSON.stringify(collection)
      );
  }, [collection]);
  //   useEffect(() => {
  //     setCollection(JSON.parse(localStorage.getItem(user.userActiveCollection)));
  //   }, [user.userActiveCollection]);

  useEffect(() => {
    localStorage.setItem("taojinUserId1", JSON.stringify(user));
  }, [user]);
  const handleAddNote = useCallback(() => {
    if (!user.userActiveCollection) {
      return;
    } //防止没有集锦的时候添加item
    //✅
    const newId = nanoid();
    setCollection((draft) => {
      draft.itemIds.push(newId);
    });
    //NOTE:此处已经新建了个note在localStorage,但collection没有新建
    localStorage.setItem(newId, JSON.stringify(initialNoteData)); //这个是否要放入useEffect?怎么放?
  }, [user.userActiveCollection]);

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
  //与chrome相关:addSite
  const [mockSite, setMockSite] = useState({
    // itemId: "",
    addTime: "123",
    itemType: "site",
    content: {
      siteTitle: "青训营社区",
      siteOrigin: "baidu.com",
      hostName: "",
      imageData: "",
      siteUrl:
        "https://www.baidu.com/s?cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&rsv_dl=fyb_n_homepage&sa=fyb_n_homepage&hisfilter=1&wd=%E5%86%B0%E9%9B%AA%E4%B8%BA%E5%AA%92%20%E5%85%B1%E8%B5%B4%E5%86%AC%E5%A5%A5%E4%B9%8B%E7%BA%A6",
    },
  });
  useEffect(() => {
    console.log("collection的监听事件添加成功");
    chrome.storage.sync.set({ addSite: false });
    chrome.storage.onChanged.addListener(function (changes, areaName) {
      //✅listen
      /* console.log("Value in " + areaName + " has been changed:");
      console.log(changes); */
      console.log(changes, "?");
      if (changes.newSite) {
        // console.log(changes.newSite.newValue);
        let newContent = changes.newSite.newValue.content;
        console.log(newContent, "!content");
        let collectedSite = {
          itemType: "site",
          content: {
            siteTitle: newContent.siteTitle,
            siteOrigin: newContent.siteOrigin,
            hostName: newContent.hostName,
            imageData: "",
            siteUrl: newContent.siteUrl,
          },
        };
        //FIXME
        // if (!user.userActiveCollection) {
        //   return;
        // } //防止没有集锦的时候添加item
        const newId = nanoid();
        setCollection((draft) => {
          draft.itemIds.push(newId);
        });
        console.log(collectedSite, "=>");
        localStorage.setItem(newId, JSON.stringify(collectedSite)); //这个是否要放入useEffect?怎么放?

        /* chrome.storage.sync.get("newSite", function (res) {
          //✅读取newSite
          // chrome.storage.sync.get("newSite",function(res){console.log(res.newSite)})
          console.log("这是newSite的res的newSite", res.newSite);
          //真正的addSite:修改collection
          // localStorage.setItem(newId, JSON.stringify(mockSite)); //这个是否要放入useEffect?怎么放?
        }); */
      }
    });
    return () => {
      //TODO:记得清除listener
    };
  }, []);

  const addSite = () => {
    //测试
    // chrome.storage.sync.get("newSite", function (res) {
    //   //✅读取newSite
    //   // setTest2(res);
    //   // setTest2(res.test);
    //   console.log("这是newSite的res", res);
    //   console.dir(res);
    //   //真正的addSite:修改collection
    // });

    //✅addSite => true
    console.log("点击了add site");
    chrome.storage.sync.set({ addSite: true }, function () {
      //是在获取的时候执行吗?如果是,目前不用管
      console.log("set addSite 为true");
    });
    // const newSite = mockSite
    /* if (!user.userActiveCollection) {
      return;
    } //防止没有集锦的时候添加item
    const newId = nanoid();
    setCollection((draft) => {
      draft.itemIds.push(newId);
    }); */
    // localStorage.setItem(newId, JSON.stringify(mockSite)); //这个是否要放入useEffect?怎么放?
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

  const saveItemData = (itemId, itemType, newContent) => {
    setCollection((draft) => {
      //之后这个采用Map结构优化itemIds
      if (!draft.itemIds.includes(itemId)) draft.itemIds.push(itemId);
    });
    const newItem = { itemType: itemType, content: newContent };
    localStorage.setItem(itemId, JSON.stringify(newItem));
  };
  //TODO:weakMap优化数据结构

  const handleDragEndAside = () => {
    console("handleDragEnd");
  };

  const handleDeleteCollection = (collectionId) => {
    const toBeDeletedItemIds = JSON.parse(
      localStorage.getItem(collectionId)
    ).itemIds;
    localStorage.removeItem(collectionId);
    toBeDeletedItemIds.map((toBeDeletedItemId) => {
      localStorage.removeItem(toBeDeletedItemId);
    }); //删除collection的时候也要删除collection里面的items
    const deleteIndex = user.userCollections.findIndex(
      (cur) => cur === collectionId
    );
    setUser((draft) => {
      draft.userCollections.splice(deleteIndex, 1);
    });
    if (user.userActiveCollection === collectionId) {
      setUser((draft) => {
        draft.userActiveCollection = user.userCollections[deleteIndex + 1];
      });
      console.log("设置成", deleteIndex + 1, "号");
      setCollection((draft) => {
        draft = JSON.parse(
          localStorage.getItem(user.userCollections[deleteIndex])
        );
      });
    }
  };

  const handleAddCollection = () => {
    const newId = nanoid();
    setUser((draft) => {
      draft.userCollections.push(newId);
    });
    if (!user.userActiveCollection)
      setUser((draft) => {
        draft.userActiveCollection = newId;
      });
    localStorage.setItem(newId, JSON.stringify(initialCollectionData));
    if (user.userCollections.length === 0) {
      setCollection((draft) => {
        draft.collectionName = "new collection";
      });
    }
  };

  const handleSwitchCollection = (targetCollectionId) => {
    setShowLeftPanel(false);
    setUser((draft) => {
      draft.userActiveCollection = targetCollectionId;
    });
    setCollection(JSON.parse(localStorage.getItem(targetCollectionId)));
    console.log(targetCollectionId);
  };
  const showMoreCollection = () => {
    setShowLeftPanel(true);
  };
  return (
    <div className="all">
      <aside className={!showLeftPanel ? "left-panel" : "hover-left-panel"}>
        <div className="fixed-bar">
          <header className="title">
            <div>Collections</div>
          </header>
          <button className="add-new-collection" onClick={handleAddCollection}>
            Add new collection
          </button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndAside}
        >
          <article className="column">
            <SortableContext
              items={user.userCollections} //参考了👉提供的解决方案https://codesandbox.io/s/wnxzo?file=/src/App.jsx:656-680
              strategy={verticalListSortingStrategy}
            >
              <CollectionList
                activeCollectionFullData={activeCollectionFullData} //FIXME
                itemIds={user.userCollections}
                handleSwitchCollection={handleSwitchCollection}
                deleteItem={handleDeleteCollection}
              ></CollectionList>
            </SortableContext>
          </article>
        </DndContext>
      </aside>
      <main className="main">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <section className="toolbar">
            <button
              className="more-collections"
              onClick={() => showMoreCollection()}
            >
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
                activeCollectionFullData={activeCollectionFullData}
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

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1); //sourceIndex的内容移除并且将移除的内容放入removed
  result.splice(endIndex, 0, removed); //把removed插入destinationIndex处
  return result;
};
