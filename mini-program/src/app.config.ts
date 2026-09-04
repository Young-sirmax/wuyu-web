export default defineAppConfig({
  pages: [
    'pages/discover/index',
    'pages/party/index',
    'pages/message/index',
    'pages/mine/index',
    'pages/register/index',
    'pages/create-party/index',
    'pages/evaluation/index',
    'pages/appointment-detail/index',
    'pages/user-profile/index',
    'pages/toastmasters/index',
    'pages/vlog/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '胡说',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#ff6b4a',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/discover/index',
        text: '发现',
        iconPath: 'assets/tabbar/discover.svg',
        selectedIconPath: 'assets/tabbar/discover-selected.svg'
      },
      {
        pagePath: 'pages/party/index',
        text: '组局',
        iconPath: 'assets/tabbar/party.svg',
        selectedIconPath: 'assets/tabbar/party-selected.svg'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息',
        iconPath: 'assets/tabbar/message.svg',
        selectedIconPath: 'assets/tabbar/message-selected.svg'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/tabbar/mine.svg',
        selectedIconPath: 'assets/tabbar/mine-selected.svg'
      }
    ]
  }
})
