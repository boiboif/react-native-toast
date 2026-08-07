# 安装

## 环境要求

- React Native `>=0.76`
- React Native 新架构已启用
- Android API `>=24`
- iOS 部署版本满足当前 React Native 版本的最低要求

本库没有旧架构兼容层，也不依赖 `expo-modules-core`。

## React Native bare 项目

使用 npm：

```sh
npm install @boiboif/react-native-toast
```

或使用 Yarn：

```sh
yarn add @boiboif/react-native-toast
```

iOS 项目继续安装 Pods：

```sh
npx pod-install
```

React Native autolinking 会自动完成 Android Package 和 iOS Pod 注册，不需要修改
`MainApplication` 或 `AppDelegate`。

## 确认新架构

Android 的 `android/gradle.properties` 应包含：

```properties
newArchEnabled=true
```

iOS 新架构的启用方式随 React Native 版本变化。React Native 0.76 及以上的标准
模板默认使用新架构；如果项目从旧版本升级，请按照对应 React Native 版本的升级说明
重新安装 Pods。

## Android 仓库配置

Android 依赖 `com.github.getActivity:Toaster:13.8`，该工件托管在 JitPack。
库模块已经声明 JitPack。若应用强制通过 `settings.gradle` 统一管理仓库，则需要加入：

```groovy
dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
  }
}
```

## 验证安装

```tsx
import { Button, View } from 'react-native';
import Toast from '@boiboif/react-native-toast';

export default function App() {
  return (
    <View>
      <Button title="显示 Toast" onPress={() => Toast.show('安装成功')} />
    </View>
  );
}
```

原生依赖安装或升级后，需要重新构建应用；仅刷新 Metro 不会更新原生二进制。

## 下一步

- 阅读[使用与配置](/guide/usage)
- 在 Expo 项目中使用时阅读[Expo 集成](/guide/expo)
- 遇到安装问题时查看[问题排查](/guide/troubleshooting)
