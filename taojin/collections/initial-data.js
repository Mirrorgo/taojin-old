export const initialUserData = {
  //localStorage.getItem("taojinUserId1")
  userName: "taojinUser1",
  userCollections: [
    {
      collectionId: "sauqhwiqiu2s",
      items: [],
      collectionName: "这是Collections的页面的东西",
      //?review:[一个类似上面content的结构,可用于RichText]
    },
    {
      collectionId: "test1",
      items: [
        { itemId: "1asaqw", itemType: "note", content: [] },
        {
          itemId: "2ertsasa",
          itemType: "site",
          content: { url: "", name: "" },
        },
      ],
      collectionName: "仅作为临时测试",
    },
    {
      collectionId: "test2",
      items: [{ itemId: "1asaqw", itemType: "note", content: [] }],
      collectionName: "仅作为临时测试",
    },
  ],
};
//STAR:这个就是目前的数据结构👇
let dataStructureOfTaojinUserId1 = {
  //localStorage.getItem("taojinUserId1")
  userName: "taojinUser1",
  userCollections: [
    {
      collectionId: "sauqhwiqiu2s", //目前就是这串数字,其他的会用nanoid生成
      items: [
        //默认为空items
        { itemId: "1asaqw", itemType: "note", content: [] },
        {
          itemId: "2ertsasa",
          itemType: "site",
          content: { url: "", name: "" },
        },
      ],
      collectionName: "这是Collections的页面的东西",
    },
    {
      id: "collectionId2", //目前没有第二个collection,如果有会用nanoid生成
      items: [],
      collectionName: "xxx",
    },
  ],
};
const initialDnDData = {
  //dnd的测试数据,不要删除,仅作展示
  task: {
    //数据内容本体
    "task-1": { id: "task-1", content: "'task1's content" },
    "task-2": { id: "task-2", content: "'task2's content" },
    "task-3": { id: "task-3", content: "'task3's content" },
    "task-4": { id: "task-4", content: "'task4's content" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"], //task的内容和顺序
    },
  },
  columnOrder: ["column-1"],
};
const richTextDataSet1 = [
  //暂不使用,仅用于表示RichText的数据结构
  {
    type: "paragraph",
    children: [
      {
        text: 'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
      },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: 'Order when you start a line with "## " you get a level-two heading, like this:',
      },
    ],
  },
  {
    type: "heading-two",
    children: [{ text: "Try it out!" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: 'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
      },
    ],
  },
];
