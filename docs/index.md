---
layout: home

hero:
  name: '@boiboif/react-native-toast'
  text: React Native 新架构原生 Toast
  tagline: 一套 API，同时用于 bare 项目与 Expo Development Build。
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/getting-started
    - theme: alt
      text: 查看 API
      link: /api/

features:
  - title: 新架构优先
    details: 使用 React Native Codegen 与 TurboModule，只维护 React Native 0.76 及以上的新架构实现。
  - title: 双平台原生体验
    details: Android 使用 getActivity/Toaster，iOS 使用 UIKit，支持位置、时长、偏移和完整样式配置。
  - title: Bare 与 Expo
    details: 支持 React Native bare、Expo prebuild、Development Build 和 EAS Build，无需 Expo Modules。
---

## 快速示例

```ts
import Toast from '@boiboif/react-native-toast';

Toast.show('操作完成');
Toast.success('保存成功');
Toast.error('保存失败');
```

## 支持范围

| 环境 | 支持情况 |
| --- | --- |
| React Native bare 新架构 | 支持 |
| Expo prebuild / Development Build | 支持 |
| EAS Build | 支持 |
| Expo Go | 不支持自定义原生模块 |
| React Native 旧架构 | 不支持 |
| Web | 安全空实现 |

::: tip 核心要求
React Native 版本需要不低于 `0.76`，并且应用必须启用新架构。
:::

