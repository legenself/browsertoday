module.exports = {
  pluginOptions:{
    electronBuilder:{
      builderOptions:{
        "appId":"com.ziyue.todayidone",
        "productName":"今天干了啥",
        "copyright":"Copyright © 2020",
        "win":{//win相关配置
          "icon":"./app.ico",
          "target": [
            {
                "target": "nsis",//利用nsis制作安装程序
                "arch": [
                    "x64"//64位
                ]
            }
          ]
        },
        "nsis": {
          "oneClick": false, // 是否一键安装
          "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          "allowToChangeInstallationDirectory": true, // 允许修改安装目录
          "installerIcon": "./app.ico",// 安装图标
          "uninstallerIcon": "./app.ico",//卸载图标
          "installerHeaderIcon": "./app.ico", // 安装时头部图标
          "createDesktopShortcut": true, // 创建桌面图标
          "createStartMenuShortcut": true,// 创建开始菜单图标
          "shortcutName": "今天干了啥", // 图标名称
        }
      },
      nodeIntegration:true
    },
    electronDownload:{
      mirror:"https://npm.taobao.org/mirrors/electron/"
    }
  }
}