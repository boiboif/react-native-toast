# Expo 项目

本库可以同时用于 React Native bare 和 Expo 项目。Expo 侧使用的是 React Native
原生模块自动链接，不需要 `expo-module.config.json` 或 `expo-modules-core`。

## 支持的 Expo 工作流

| 工作流 | 支持情况 |
| --- | --- |
| Expo prebuild | 支持 |
| `expo run:android` / `expo run:ios` | 支持 |
| Development Build | 支持 |
| EAS Build | 支持 |
| Expo Go | 不支持 |

Expo Go 的原生二进制是固定的，无法在运行时加载本库。JavaScript 安装成功不代表
Expo Go 已包含相应的 Android/iOS 原生代码。

## 安装与生成原生项目

```sh
npx expo install @boiboif/react-native-toast
npx expo prebuild
```

本地构建 Development Client：

```sh
npx expo run:android
# 或
npx expo run:ios
```

使用 EAS：

```sh
eas build --profile development --platform android
# 或
eas build --profile development --platform ios
```

## 新架构配置

React Native 版本必须不低于 `0.76`。对于仍允许显式配置新架构的 Expo SDK，可以在
`app.json` 中设置：

```json
{
  "expo": {
    "newArchEnabled": true
  }
}
```

修改此配置、升级本库或首次安装本库后，必须重新运行 prebuild 并重建 Development
Client。

## Expo Web

Web 平台使用安全空实现：调用 API 不会抛出缺少原生模块的错误，但页面上不会显示
Toast。Web 项目如需可视化提示，应在业务层选择专用 Web Toast 组件。

## 是否需要 Config Plugin

不需要。本库没有修改权限、Manifest、Info.plist 或应用入口的需求，React Native
autolinking 足以完成集成。

