# Installation

## Requirements

- React Native `>=0.76`
- React Native New Architecture enabled
- Android API `>=24`
- An iOS deployment target supported by the installed React Native version

The package has no legacy architecture layer and does not depend on
`expo-modules-core`.

## Bare React Native

Install with npm:

```sh
npm install @boiboif/react-native-toast
```

Or Yarn:

```sh
yarn add @boiboif/react-native-toast
```

Install CocoaPods dependencies on iOS:

```sh
npx pod-install
```

React Native autolinking registers the Android package and iOS Pod. You do not
need to modify `MainApplication` or `AppDelegate`.

## Confirm the New Architecture

Android should contain this setting in `android/gradle.properties`:

```properties
newArchEnabled=true
```

New React Native 0.76 and later templates enable the New Architecture by
default. Projects upgraded from older releases should follow the upgrade guide
for their exact React Native version and reinstall Pods.

## Android repository setup

Android depends on `com.github.getActivity:Toaster:13.8`, hosted on JitPack. The
library declares JitPack itself. Apps that enforce repositories from
`settings.gradle` must add:

```groovy
dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
  }
}
```

## Verify the installation

```tsx
import { Button, View } from 'react-native';
import Toast from '@boiboif/react-native-toast';

export default function App() {
  return (
    <View>
      <Button title="Show toast" onPress={() => Toast.show('It works')} />
    </View>
  );
}
```

Rebuild the native app after installing or upgrading the package. Reloading
Metro alone cannot update the native binary.

## Next steps

- Continue with [usage and configuration](/en/guide/usage)
- Read the [Expo integration guide](/en/guide/expo) for Expo projects
- Check [troubleshooting](/en/guide/troubleshooting) when installation fails
