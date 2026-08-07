# API 参考

## 默认导出

```ts
import Toast from '@boiboif/react-native-toast';
```

### `Toast.show`

```ts
Toast.show(message: string, options?: ToastOptions): void
```

显示普通 Toast。新请求会替换当前正在显示的 Toast。

### `Toast.success` / `error` / `warning` / `info`

```ts
Toast.success(message: string, options?: ToastOptions): void
Toast.error(message: string, options?: ToastOptions): void
Toast.warning(message: string, options?: ToastOptions): void
Toast.info(message: string, options?: ToastOptions): void
```

使用对应预设样式显示 Toast。调用时传入的样式优先于预设样式。

### `Toast.hide`

```ts
Toast.hide(): void
```

立即取消当前 Toast，并清除尚未显示的 pending 请求。

### `Toast.config`

```ts
Toast.config(config: ToastConfig): void
```

合并全局默认参数和预设样式。传入 `defaultOptions.style` 时也会同步原生默认样式。

### `Toast.showSystem`

```ts
Toast.showSystem(message: string): void
```

Android 使用系统 Toast；iOS 使用普通 UIKit Toast。

## 类型

### `ToastOptions`

```ts
type ToastOptions = {
  duration?: 'short' | 'long';
  position?: 'top' | 'center' | 'bottom';
  xOffset?: number;
  yOffset?: number;
  style?: ToastStyleOptions;
};
```

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `duration` | `short` | 显示时长 |
| `position` | `bottom` | 显示位置 |
| `xOffset` | `0` | 水平偏移，Android 为 dp、iOS 为 point |
| `yOffset` | `0` | 垂直偏移 |
| `style` | 见下表 | 自定义样式 |

### `ToastStyleOptions`

```ts
type ToastStyleOptions = {
  backgroundColor?: string | number;
  textColor?: string | number;
  textSize?: number;
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  maxLines?: number;
};
```

| 字段 | 原生默认值 | 单位或格式 |
| --- | --- | --- |
| `backgroundColor` | 半透明黑色 | `#RRGGBB`、`#AARRGGBB`、`0xAARRGGBB` |
| `textColor` | 白色 | 同上 |
| `textSize` | `14` | sp / point |
| `borderRadius` | `10` | dp / point |
| `paddingHorizontal` | `16` | dp / point |
| `paddingVertical` | `10` | dp / point |
| `maxLines` | `2` | 行数 |

### `ToastConfig`

```ts
type ToastConfig = {
  defaultOptions?: ToastOptions;
  presetStyles?: Partial<
    Record<'success' | 'error' | 'info' | 'warning', ToastStyleOptions>
  >;
};
```

## 命名导出

```ts
import Toast, {
  Toast as NamedToast,
  Native,
  type ToastConfig,
  type ToastDuration,
  type ToastOptions,
  type ToastPosition,
  type ToastPreset,
  type ToastStyleOptions,
} from '@boiboif/react-native-toast';
```

## 高级原生接口

`Native` 用于调试或兼容底层接口。业务代码优先使用 `Toast`：

```ts
Native.isSupported
Native.init()
Native.isInit()
Native.show(message)
Native.showWithOptions(message, options?)
Native.showShort(message)
Native.showLong(message)
Native.debugShow(message)
Native.delayedShow(message, delayMillis)
Native.showSystem(message)
Native.cancel()
Native.setDefaultStyle(style)
Native.setGravity(gravity)
Native.setGravityWithOffset(gravity, xOffset, yOffset)
```

`setGravity` 和 `setGravityWithOffset` 只在 Android 有实际效果。

