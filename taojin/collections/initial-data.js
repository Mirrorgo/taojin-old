export const initialUserData = {
  userName: "taojinUser1",
  userCollections: [
    {
      collectionId: "sauqhwiqiu2s",
      items: [],
      collectionName: "这是Collections的页面的东西",
      order: 1,
      //review:[一个类似上面content的结构,可用于RichText]
    },
  ],
};
const initialData = {
  //dnd的测试数据
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

export default initialData;

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
