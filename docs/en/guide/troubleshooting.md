# Troubleshooting

## The `ReactNativeToast` TurboModule cannot be found

A common error is `TurboModuleRegistry.getEnforcing(...): 'ReactNativeToast'
could not be found`. Verify that:

1. React Native is 0.76 or newer
2. The New Architecture is enabled
3. The native app was rebuilt after installation
4. CocoaPods was reinstalled on iOS
5. The app is not running inside Expo Go

Restarting Metro cannot add a new native module to an installed binary.

## Android cannot resolve the Toaster dependency

If Gradle cannot find `com.github.getActivity:Toaster:13.8`, add JitPack to the
app's `settings.gradle` or `settings.gradle.kts`:

```groovy
dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
  }
}
```

Corporate repository proxies must also allow access to `https://jitpack.io`.

## iOS compilation or linking fails

Clean and reinstall Pods:

```sh
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

Then build the `.xcworkspace`. Ensure that the Podfile does not disable React
Native Codegen and that the deployment target satisfies the current React
Native release.

## A toast does not appear during startup

When the Activity or UIWindow is not ready, the native layer keeps the latest
request briefly and retries. For long initialization sequences, show the toast
after the first screen mounts instead of calling it at module scope.

## Position differs between platforms

- Top and bottom positions account for safe areas
- A zero `yOffset` applies default safe spacing
- Android uses dp and iOS uses points
- `Native.setGravity` is an Android compatibility API; regular calls should use
  `position`

## Eight-digit colors have the wrong opacity

The package accepts `#AARRGGBB`, not the web-oriented `#RRGGBBAA`. For example,
an 80% opaque black is `#CC000000`.

## Import succeeds in Expo but calls fail

The app is usually running an old development client or Expo Go. Run
`expo prebuild` and create a new client. An OTA update cannot introduce a new
native dependency.
