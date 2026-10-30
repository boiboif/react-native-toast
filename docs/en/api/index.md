# API reference

## Default export

```ts
import Toast from '@boiboif/react-native-toast';
```

### `Toast.show`

```ts
Toast.show(message: string, options?: ToastOptions): void
```

Shows a regular toast. A new request replaces the currently visible toast.

### `Toast.success` / `error` / `warning` / `info`

```ts
Toast.success(message: string, options?: ToastOptions): void
Toast.error(message: string, options?: ToastOptions): void
Toast.warning(message: string, options?: ToastOptions): void
Toast.info(message: string, options?: ToastOptions): void
```

Shows a toast with the matching preset. Per-call styles override preset styles.

### `Toast.hide`

```ts
Toast.hide(): void
```

Cancels the current toast and clears a pending request that has not appeared.

### `Toast.config`

```ts
Toast.config(config: ToastConfig): void
```

Merges global defaults and preset styles. `defaultOptions.style` and each preset
style merge by field, so a partial update preserves previously configured fields.
Passing `defaultOptions.style` also synchronizes the full merged style to the
native default style.

Pass `defaultOptions: { style: undefined }` to clear the global custom style and
reset the native default style. The advanced `Native.setDefaultStyle` API replaces
the native default style directly.

### `Toast.showSystem`

```ts
Toast.showSystem(message: string): void
```

Uses a system Toast on Android and the regular UIKit toast on iOS.

## Types

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

| Field | Default | Description |
| --- | --- | --- |
| `duration` | `short` | Display duration |
| `position` | `bottom` | Screen position |
| `xOffset` | `0` | Horizontal offset in dp / points |
| `yOffset` | `0` | Vertical offset in dp / points |
| `style` | See below | Visual style |

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

| Field | Native default | Unit or format |
| --- | --- | --- |
| `backgroundColor` | Translucent black | `#RRGGBB`, `#AARRGGBB`, `0xAARRGGBB` |
| `textColor` | White | Same color formats |
| `textSize` | `14` | sp / points |
| `borderRadius` | `10` | dp / points |
| `paddingHorizontal` | `16` | dp / points |
| `paddingVertical` | `10` | dp / points |
| `maxLines` | `2` | Lines |

### `ToastConfig`

```ts
type ToastConfig = {
  defaultOptions?: ToastOptions;
  presetStyles?: Partial<
    Record<'success' | 'error' | 'info' | 'warning', ToastStyleOptions>
  >;
};
```

## Named exports

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

## Advanced native API

`Native` is available for debugging and low-level compatibility. Application
code should prefer `Toast`:

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

`setGravity` and `setGravityWithOffset` only have an effect on Android.
The advanced `Native.setGravityWithOffset` API takes offsets in pixels;
offsets in `ToastOptions` use dp.

