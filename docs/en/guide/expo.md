# Expo projects

The same package works in bare React Native and Expo projects. Expo uses React
Native native-module autolinking, so no `expo-module.config.json` or
`expo-modules-core` dependency is required.

## Supported Expo workflows

| Workflow | Support |
| --- | --- |
| Expo prebuild | Supported |
| `expo run:android` / `expo run:ios` | Supported |
| Development Build | Supported |
| EAS Build | Supported |
| Expo Go | Not supported |

Expo Go ships with a fixed native binary and cannot load this package at
runtime. A successful JavaScript installation does not add Android or iOS code
to Expo Go.

## Install and generate native projects

```sh
npx expo install @boiboif/react-native-toast
npx expo prebuild
```

Build a local development client:

```sh
npx expo run:android
# or
npx expo run:ios
```

With EAS:

```sh
eas build --profile development --platform android
# or
eas build --profile development --platform ios
```

## New Architecture configuration

The Expo SDK must use React Native 0.76 or newer. For Expo SDK versions that
still expose an explicit setting, enable it in `app.json`:

```json
{
  "expo": {
    "newArchEnabled": true
  }
}
```

After changing this setting, installing the package, or upgrading it, run
prebuild again and create a new development client.

## Expo Web

Web resolves to a safe no-op implementation. API calls do not fail because a
native module is missing, but no visual toast is rendered. Use a dedicated web
toast component when the web target needs visible feedback.

## Config Plugin

No Config Plugin is required. The package does not need permissions, Manifest
entries, Info.plist changes, or app-entry modifications. React Native
autolinking is sufficient.

