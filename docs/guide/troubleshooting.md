# 问题排查

## 找不到 `ReactNativeToast` TurboModule

常见错误包括 `TurboModuleRegistry.getEnforcing(...): 'ReactNativeToast' could not be
found`。依次确认：

1. React Native 版本不低于 `0.76`
2. 新架构已经启用
3. 安装依赖后重新构建过原生应用
4. iOS 已重新执行 `pod install`
5. 当前运行的不是 Expo Go

仅重启 Metro 无法把新的原生模块加入已安装的应用。

## Android 无法解析 Toaster 依赖

如果 Gradle 报错找不到 `com.github.getActivity:Toaster:13.8`，请在应用的
`settings.gradle` 或 `settings.gradle.kts` 中加入 JitPack：

```groovy
dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
  }
}
```

企业仓库代理环境还需要允许访问 `https://jitpack.io`。

## iOS 编译或链接失败

先清理并重新安装 Pods：

```sh
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

然后从 `.xcworkspace` 重新构建。确认 Podfile 没有禁用 React Native Codegen，且应用
使用的最低 iOS 版本符合当前 React Native 要求。

## 启动阶段没有显示 Toast

当 Activity 或 UIWindow 尚未可用时，原生层会暂存最新请求并在短时间内重试。若应用
初始化耗时较长，建议在首个页面完成挂载后再显示 Toast，而不是在模块顶层立即调用。

## Toast 位置与预期不同

- 顶部和底部位置会考虑安全区域
- `yOffset: 0` 会使用默认安全间距
- Android 使用 dp，iOS 使用 point
- `Native.setGravity` 是 Android 兼容接口，常规调用应使用 `position`

## 八位颜色透明度错误

本库使用 `#AARRGGBB`，不是 Web 常见的 `#RRGGBBAA`。例如 80% 不透明黑色可写成
`#CC000000`。

## Expo 中 JavaScript 可导入但调用失败

这通常表示正在运行旧的 Development Client 或 Expo Go。重新运行 `expo prebuild`
并构建新的客户端；OTA 更新不能加入新的原生依赖。
