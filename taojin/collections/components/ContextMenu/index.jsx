import React, { useCallback, useEffect, useState } from "react";

//学习自https://www.pluralsight.com/guides/how-to-create-a-right-click-menu-using-react
export default function ContextMenu({ menu }) {
  const { xPos, yPos, showMenu } = useContextMenu();
  return (
    showMenu && (
      <div
        style={{
          position: "absolute",
          top: yPos,
          left: xPos,
          backgroundColor: "white",
        }}
      >
        {menu}
      </div>
    )
  );
}

const useContextMenu = () => {
  const [xPos, setXPos] = useState("0px");
  const [yPos, setYPos] = useState("0px");
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      setXPos(`${e.pageX}px`);
      setYPos(`${e.pageY}px`);
      setShowMenu(true);
    },
    [setXPos, setYPos]
  );

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false); //showMenu存在则运行setShowMenu(false)
  }, [showMenu]);
  //TODO:查useEffect为什么执行了那么多次
  useEffect(() => {
    //TODO:传入一个ref以实现仅某个元素添加事件
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      //FIXME哪种正确?
      //   document.addEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { xPos, yPos, showMenu }; //三个set都不需要,就不必返回了
  //hook的设计确实优雅
  //TODO:把所有的东西都改成hook来实现
};
