# 使用与配置

## 基础调用

默认 Toast 使用短时长并显示在底部：

```ts
import Toast from '@boiboif/react-native-toast';

Toast.show('操作完成');
```

## 语义预设

四个预设只负责合并颜色等样式，调用方式与 `show` 相同：

```ts
Toast.success('保存成功');
Toast.error('保存失败');
Toast.warning('请检查输入内容');
Toast.info('发现新版本');
```

默认背景色如下：

| 预设 | 默认颜色 |
| --- | --- |
| `success` | `#52C41A` |
| `error` | `#FF4D4F` |
| `warning` | `#FAAD14` |
| `info` | `#1890FF` |

## 位置与时长

```ts
Toast.show('顶部提示', {
  position: 'top',
  duration: 'long',
  xOffset: 0,
  yOffset: 12,
});
```

- `duration` 支持 `short` 和 `long`
- `position` 支持 `top`、`center` 和 `bottom`
- `xOffset`、`yOffset` 在 Android 使用 dp，在 iOS 使用 point
- `top` 或 `bottom` 且 `yOffset` 为 `0` 时，会分别使用 16 和 48 的安全间距

## 自定义样式

```ts
Toast.show('自定义样式', {
  style: {
    backgroundColor: '#E6111111',
    textColor: '#FFFFFF',
    textSize: 16,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxLines: 3,
  },
});
```

颜色可使用：

- `#RRGGBB`
- `#AARRGGBB`
- 数字形式 `0xAARRGGBB`

::: warning 透明度顺序
八位十六进制颜色使用 ARGB 顺序，即透明度在最前面，例如 `#CC111111`。
:::

## 全局配置

`Toast.config` 修改当前 JavaScript 运行环境中的默认参数和预设样式：

```ts
Toast.config({
  defaultOptions: {
    duration: 'short',
    position: 'bottom',
    yOffset: 0,
    style: {
      backgroundColor: '#111111',
      textColor: '#FFFFFF',
      textSize: 14,
      borderRadius: 8,
    },
  },
  presetStyles: {
    success: { backgroundColor: '#16A34A' },
    error: { backgroundColor: '#DC2626' },
  },
});
```

样式合并优先级从高到低为：

1. 单次 `show` 或预设方法传入的样式
2. `presetStyles` 中的预设样式
3. `defaultOptions.style` 中的默认样式

配置保存在模块内存中，Fast Refresh 或 JavaScript 运行时重启后会恢复初始值。建议在
应用入口处集中调用一次 `Toast.config`。

## 隐藏当前 Toast

```ts
Toast.hide();
```

显示新的 Toast 时，当前 Toast 也会先被取消，避免多个提示重叠。

## 系统 Toast

```ts
Toast.showSystem('系统 Toast');
```

Android 会明确调用系统 Toast；常规业务应优先使用 `Toast.show` 提供的
`ActivityToast`。iOS 没有等价的系统 Toast，因此仍走普通 UIKit 实现。

