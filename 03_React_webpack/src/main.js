import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 生成root根节点
const root = ReactDOM.createRoot(document.getElementById('app'));
// 渲染App组件
root.render(<App />);