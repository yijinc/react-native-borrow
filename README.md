

- `react-native` 为最新版本 [0.57](https://reactnative.cn/docs/tutorial.html)

- 使用了 `flow` 静态类型语法 替代了 `prop-types` (不仅对react, 对其他js都可以使用)

- `Debug Js Remotly`存在跨域问题，下载谷歌插件[allow-control-allow-origi](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en)


- ios 图标暂未配置 [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons#ios)
- ios 渐变按钮未配置 [react-native-linear-gradient](https://github.com/react-native-community/react-native-linear-gradient)


## 开发
   
    yarn
    react-native run-android    // react-devtools

    
推荐安装 [react-native-debugger](https://github.com/jhen0409/react-native-debugger) 调试

`yarn/npm run debug` 常用命令
```
    $r      //  在 **Elements** 面板选择的组件
    showAsyncStorageContentInDev()  // 打印 AsyncStorage 内容
    $reactNative.*  // * 为任意react-native 组件/函数
    global  // 全局对象
```

## iOS打包

    cd ios
    fastlane beta       #上传到pgyer
    fastlane release    #上传到itc

## Android

    cd android && ./gradlew clean && ./gradlew assembleRelease   # 在android/app/build/outputs/apk 生成app-release.apk


输入以下命令可以在设备上安装发行版本 // --variant=release参数只能在你完成了签名配置之后才可以使用
`react-native run-android --variant=release`

**note**: android/app/build.gradle 将 `enableSeparateBuildPerCPUArchitecture=true` 针对不同的 CPU 架构生成的两个 APK , 都上传到支持对用户设备 CPU 架构定位的应用程序商店，例如 Google Play 和 Amazon AppStore，用户将自动获得相应的 APK。如果您想上传到其他市场，例如 APKFiles（不支持一个应用有多个 APK 文件），可以修改`universalApk true`，来额外生成一个适用不同 CPU 架构的通用 APK。