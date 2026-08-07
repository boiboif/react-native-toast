# @boiboif/react-native-toast

[English](README.md) | [简体中文](README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/%40boiboif%2Freact-native-toast)](https://www.npmjs.com/package/@boiboif/react-native-toast)
[![npm downloads](https://img.shields.io/npm/dm/%40boiboif%2Freact-native-toast)](https://www.npmjs.com/package/@boiboif/react-native-toast)
[![CI](https://github.com/boiboif/react-native-toast/actions/workflows/ci.yml/badge.svg)](https://github.com/boiboif/react-native-toast/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/%40boiboif%2Freact-native-toast)](LICENSE)

A typed, customizable native Toast library for the React Native New
Architecture. It works in bare React Native apps and Expo development builds
without depending on Expo Modules.

## Features

- TurboModule built for the React Native New Architecture
- Bare React Native and Expo prebuild/development build support
- Native Android implementation powered by
  [getActivity/Toaster](https://github.com/getActivity/Toaster)
- Native UIKit implementation on iOS
- Success, error, warning, and info presets
- Position, duration, offset, color, typography, padding, and radius options
- Synchronous cancellation and global configuration
- Full TypeScript declarations and React Native autolinking

## Compatibility

| Environment | Support |
| --- | --- |
| React Native bare, New Architecture | Yes |
| Expo prebuild / development build / EAS Build | Yes |
| Expo Go | No custom native modules |
| React Native legacy architecture | Not supported |
| Web | Safe no-op |

Requirements: React Native `>=0.76`, New Architecture enabled, and Android API
24 or newer. The iOS deployment target follows the minimum required by the
installed React Native version.

## Installation

```sh
npm install @boiboif/react-native-toast
```

Or with Yarn:

```sh
yarn add @boiboif/react-native-toast
```

Install CocoaPods dependencies for iOS:

```sh
npx pod-install
```

Autolinking handles native registration. No manual package registration is
required.

### Expo

```sh
npx expo install @boiboif/react-native-toast
npx expo prebuild
npx expo run:android
# or: npx expo run:ios
```

After adding the native dependency, rebuild the development client. This
package cannot run inside Expo Go.

### Android and JitPack

Android uses `com.github.getActivity:Toaster:13.8`, which is hosted on JitPack.
The library declares the repository itself. If the app enforces repositories
from `settings.gradle`, add:

```groovy
dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
  }
}
```

## Quick start

```ts
import Toast from '@boiboif/react-native-toast';

Toast.show('Operation completed');
Toast.success('Saved successfully');
Toast.error('Save failed');
Toast.warning('Please check your input');
Toast.info('A new version is available');
```

## Customization

```ts
Toast.show('Custom toast', {
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

Colors accept `#RRGGBB`, `#AARRGGBB`, or numeric `0xAARRGGBB` values.

## Global configuration

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

Style precedence is: per-call style, preset style, then global default style.

## API summary

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

The package exports the `ToastOptions`, `ToastStyleOptions`, `ToastConfig`,
`ToastPosition`, `ToastDuration`, and `ToastPreset` types.

Read the complete [documentation](https://boiboif.github.io/react-native-toast/)
for API details, Expo integration, platform behavior, and troubleshooting.

## Development

```sh
yarn
yarn typecheck
yarn lint
yarn prepare
yarn docs:dev
```

Build the static documentation site with `yarn docs:build`.

## License

MIT
