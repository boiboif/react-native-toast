# @boiboif/react-native-toast

[English](README.md) | [简体中文](README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/%40boiboif%2Freact-native-toast)](https://www.npmjs.com/package/@boiboif/react-native-toast)
[![npm downloads](https://img.shields.io/npm/dm/%40boiboif%2Freact-native-toast)](https://www.npmjs.com/package/@boiboif/react-native-toast)
[![CI](https://github.com/boiboif/react-native-toast/actions/workflows/ci.yml/badge.svg)](https://github.com/boiboif/react-native-toast/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/%40boiboif%2Freact-native-toast)](LICENSE)

一个类型完善、可自定义的 React Native 原生 Toast 库，专为新架构构建。
它同时支持 React Native bare 项目和 Expo Development Build，不依赖 Expo
Modules。

## 特性

- 基于 TurboModule，仅面向 React Native 新架构
- 同时支持 React Native bare 与 Expo prebuild/development build
- Android 基于 [getActivity/Toaster](https://github.com/getActivity/Toaster)
- iOS 使用原生 UIKit 实现
- 内置成功、错误、警告和信息四种预设
- 支持位置、时长、偏移、颜色、字号、内边距和圆角配置
- 支持立即隐藏和全局默认配置
- 完整 TypeScript 类型和 React Native 自动链接

## 兼容性

| 环境 | 支持情况 |
| --- | --- |
| React Native bare 新架构项目 | 支持 |
| Expo prebuild / Development Build / EAS Build | 支持 |
| Expo Go | 不支持自定义原生模块 |
| React Native 旧架构 | 不支持 |
| Web | 安全空实现 |

要求 React Native `>=0.76`、开启新架构且 Android API 不低于 24。iOS
最低部署版本跟随当前 React Native 版本的要求。

## 安装

```sh
npm install @boiboif/react-native-toast
```

或使用 Yarn：

```sh
yarn add @boiboif/react-native-toast
```

iOS 安装后需要更新 CocoaPods：

```sh
npx pod-install
```

原生模块由 autolinking 自动注册，无需手动修改应用入口。

### Expo

```sh
npx expo install @boiboif/react-native-toast
npx expo prebuild
npx expo run:android
# 或：npx expo run:ios
```

加入原生依赖后必须重新构建 Development Client。本库无法在 Expo Go 中运行。

### Android 与 JitPack

Android 依赖托管在 JitPack 的 `com.github.getActivity:Toaster:13.8`。库本身
已经声明仓库。如果应用通过 `settings.gradle` 强制统一管理仓库，请加入：

```groovy
dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
  }
}
```

## 快速开始

```ts
import Toast from '@boiboif/react-native-toast';

Toast.show('操作完成');
Toast.success('保存成功');
Toast.error('保存失败');
Toast.warning('请检查输入内容');
Toast.info('发现新版本');
```

## 自定义样式

```ts
Toast.show('自定义 Toast', {
  duration: 'long',
  position: 'top',
  xOffset: 0,
  yOffset: 12,
  style: {
    backgroundColor: '#111111',
    textColor: '#FFFFFF',
    textSize: 16,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxLines: 2,
  },
});
```

颜色支持 `#RRGGBB`、`#AARRGGBB` 或数字形式的 `0xAARRGGBB`。

## 全局配置

```ts
Toast.config({
  defaultOptions: {
    duration: 'short',
    position: 'bottom',
    style: {
      backgroundColor: '#111111',
      textColor: '#FFFFFF',
    },
  },
  presetStyles: {
    success: { backgroundColor: '#16A34A' },
    error: { backgroundColor: '#DC2626' },
    warning: { backgroundColor: '#F59E0B' },
    info: { backgroundColor: '#2563EB' },
  },
});
```

样式优先级依次为：单次调用样式、预设样式、全局默认样式。

## API 概览

```ts
Toast.show(message, options?)
Toast.success(message, options?)
Toast.error(message, options?)
Toast.warning(message, options?)
Toast.info(message, options?)
Toast.hide()
Toast.config(config)
Toast.showSystem(message)
```

包内同时导出了 `ToastOptions`、`ToastStyleOptions`、`ToastConfig`、
`ToastPosition`、`ToastDuration` 和 `ToastPreset` 类型。

完整 API、Expo 集成、平台行为与问题排查请阅读
[在线文档](https://boiboif.github.io/react-native-toast/)。

## 本地开发

```sh
yarn
yarn typecheck
yarn lint
yarn prepare
yarn docs:dev
```

使用 `yarn docs:build` 生成静态文档站点。

## 许可证

MIT
