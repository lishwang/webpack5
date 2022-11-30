import React from 'react';
// 引入路由链接导航Link组件来进行路由跳转
// 引入Routes、Route用于加载显示路由组件
import {Link, Routes, Route} from 'react-router-dom'

import Home from './pages/home';
import About from './pages/about';

function App() {
  return (
    <div>
      <h1>App</h1>
      {/* 导航链接 */}
      <ul>
        <li>
          <Link to="/home">home</Link>
        </li>
        <li>
          <Link to="/about">about</Link>
        </li>
      </ul>

      <Routes>
        {/* 每一个Route就是一个路由组件，需要指定路由路径path 以及 要加载的路由组件element */}
        <Route path='/home' element={ <Home /> }></Route>
        <Route path='/about' element={ <About /> }></Route>
      </Routes>
    </div>
  )
}

export default App