import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import Taro from '@tarojs/taro';
// 全局样式
import './app.scss';

function App(props) {
  useEffect(() => {
    // 初始化微信云开发（仅微信平台）
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({ env: '', traceUser: true });
    }
  });

  useDidShow(() => {});

  useDidHide(() => {});

  return props.children;
}

export default App;
