# 概述
[开发文档](https://bytedancecampus1.feishu.cn/docs/doccn1YrXaBige715g2zJXJWXde#)
[项目地址](https://github.com/fengfengchenchen/TaoJin)
# 目录结构
.
├── index.html //popup
├── public //build后不变的文件夹
│   ├── background.js //常驻运行在 chrome 后台的脚本
│   ├── images //保存各种图片
│   └── manifest.json //chrome插件的入口
├── src //build后会放入dist的assets文件夹中
│   ├── App.css
│   ├── App.jsx //根组件
│   ├── api // 网路请求代码、工具类函数和相关配置
│   ├── assets // 字体配置及全局样式
│   │   └── font
│   ├── baseUI //基础UI轮子
│   ├── components //可复用UI组件
│   ├── favicon.svg
│   ├── index.css
│   ├── logo.svg
│   ├── main.jsx //入口文件
│   └── routes //路由配置文件
├── taojin //其他插件的页面
│   └── options.html
└── vite.config.js //vite的配置文件
# 使用方式
build生成dist文件夹,以dist为根目录在开发者模式下导入浏览器即可