// lazy 用于定义路由懒加载的组件
// 懒加载组件必须要包裹在 Suspense 标签里面才能够实现懒加载
import React, { Suspense, lazy } from 'react';
// 引入路由链接导航Link组件来进行路由跳转
// 引入Routes、Route用于加载显示路由组件
import {Link, Routes, Route} from 'react-router-dom'

// import Home from './pages/home';
// import About from './pages/about';
// 路由懒加载引入组件
const Home = lazy(() => import('./pages/home'));
const About = lazy(() => import('./pages/about'));

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

      {/* 懒加载组件必须要包裹在 Suspense 标签里面才能够实现懒加载，fallback属性用于定义在懒加载组件渲染之前展示的内容 */}
      <Suspense fallback={<div>在懒加载组件渲染之前展示的内容</div>}>
        <Routes>
          {/* 每一个Route就是一个路由组件，需要指定路由路径path 以及 要加载的路由组件element */}
          <Route path='/home' element={ <Home /> }></Route>
          <Route path='/about' element={ <About /> }></Route>
        </Routes>
      </Suspense>
      
    </div>
  )
}

export default App