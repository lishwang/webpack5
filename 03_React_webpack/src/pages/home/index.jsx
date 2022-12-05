import React from 'react';

import './index.less';

// 使用 antd UI组件库
import { Button } from 'antd';

export default function Home() {
  return <div>
    <h1 className='home-title'>home~~</h1>
    <Button type='primary'>按钮</Button>
  </div>
}