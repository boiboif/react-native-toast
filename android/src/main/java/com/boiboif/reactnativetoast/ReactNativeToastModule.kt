package com.boiboif.reactnativetoast

import com.facebook.react.bridge.ReactApplicationContext

class ReactNativeToastModule(reactContext: ReactApplicationContext) :
  NativeReactNativeToastSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeReactNativeToastSpec.NAME
  }
}
