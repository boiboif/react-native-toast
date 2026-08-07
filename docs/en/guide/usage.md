# Usage and configuration

## Basic usage

The default toast uses the short duration and bottom position:

```ts
import Toast from '@boiboif/react-native-toast';

Toast.show('Operation completed');
```

## Semantic presets

The four presets merge semantic styles and accept the same options as `show`:

```ts
Toast.success('Saved successfully');
Toast.error('Save failed');
Toast.warning('Please check your input');
Toast.info('A new version is available');
```

| Preset | Default color |
| --- | --- |
| `success` | `#52C41A` |
| `error` | `#FF4D4F` |
| `warning` | `#FAAD14` |
| `info` | `#1890FF` |

## Position and duration

```ts
Toast.show('Top message', {
  position: 'top',
  duration: 'long',
  xOffset: 0,
  yOffset: 12,
});
```

- `duration` accepts `short` or `long`
- `position` accepts `top`, `center`, or `bottom`
- `xOffset` and `yOffset` use dp on Android and points on iOS
- A zero `yOffset` at the top or bottom uses safe spacing of 16 or 48

## Custom styles

```ts
Toast.show('Custom style', {
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

Colors accept:

- `#RRGGBB`
- `#AARRGGBB`
- Numeric `0xAARRGGBB`

::: warning Alpha channel order
Eight-digit colors use ARGB order, with alpha first. For example, use
`#CC111111` for an 80% opaque dark color.
:::

## Global configuration

`Toast.config` updates defaults and preset styles for the current JavaScript
runtime:

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

Style precedence from highest to lowest is:

1. Per-call style passed to `show` or a preset method
2. The matching entry in `presetStyles`
3. The style in `defaultOptions.style`

Configuration is kept in module memory and resets after Fast Refresh or a
JavaScript runtime restart. Configure the library once near the app entry point.

## Hide the current toast

```ts
Toast.hide();
```

Showing a new toast also cancels the current one to prevent overlap.

## System toast

```ts
Toast.showSystem('System toast');
```

Android explicitly uses the system Toast implementation. Prefer `Toast.show`
and its `ActivityToast` path for regular application messages. iOS has no system
Toast equivalent and uses the normal UIKit implementation.

