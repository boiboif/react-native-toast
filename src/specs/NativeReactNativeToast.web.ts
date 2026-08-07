import type { Spec } from './NativeReactNativeToast';

const NativeReactNativeToast: Spec = {
  getIsSupported: () => false,
  setup: () => undefined,
  isInitialized: () => false,
  showWithOptions: () => undefined,
  debugShow: () => undefined,
  delayedShow: () => undefined,
  showSystem: () => undefined,
  cancel: () => undefined,
  setDefaultStyle: () => undefined,
  setGravity: () => undefined,
  setGravityWithOffset: () => undefined,
};

export default NativeReactNativeToast;
