---
layout: home

hero:
  name: '@boiboif/react-native-toast'
  text: Native Toast for the React Native New Architecture
  tagline: One API for bare React Native apps and Expo development builds.
  actions:
    - theme: brand
      text: Get started
      link: /en/guide/getting-started
    - theme: alt
      text: View API
      link: /en/api/

features:
  - title: New Architecture first
    details: Built with React Native Codegen and TurboModule for React Native 0.76 and newer, without a legacy bridge layer.
  - title: Native on both platforms
    details: getActivity/Toaster on Android and UIKit on iOS, with position, duration, offset, and style controls.
  - title: Bare and Expo
    details: Works with bare React Native, Expo prebuild, development builds, and EAS Build without Expo Modules.
---

## Quick example

```ts
import Toast from '@boiboif/react-native-toast';

Toast.show('Operation completed');
Toast.success('Saved successfully');
Toast.error('Save failed');
```

## Support matrix

| Environment | Support |
| --- | --- |
| Bare React Native with New Architecture | Supported |
| Expo prebuild / development build | Supported |
| EAS Build | Supported |
| Expo Go | Custom native modules are unavailable |
| React Native legacy architecture | Not supported |
| Web | Safe no-op |

::: tip Core requirement
Use React Native `0.76` or newer and enable the New Architecture in the app.
:::

