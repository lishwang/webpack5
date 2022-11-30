import React from 'react';
import ReactDOM from 'react-dom/client';
// 前端路由必须包裹在 BrowserRouter 标签下才能被解析，BrowserRouter内部会封装context语法做一些路由参数的通信等；
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 生成root根节点
const root = ReactDOM.createRoot(document.getElementById('app'));
// 渲染App组件
root.render(<BrowserRouter>
  <App />
</BrowserRouter>);