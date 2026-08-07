import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  getIsSupported(): boolean;
  setup(): void;
  isInitialized(): boolean;
  showWithOptions(
    message: string,
    duration: string,
    position: string,
    xOffset: Double,
    yOffset: Double,
    backgroundColor: string,
    textColor: string,
    textSize: Double,
    borderRadius: Double,
    paddingHorizontal: Double,
    paddingVertical: Double,
    maxLines: Int32
  ): void;
  debugShow(message: string): void;
  delayedShow(message: string, delayMillis: Double): void;
  showSystem(message: string): void;
  cancel(): void;
  setDefaultStyle(
    reset: boolean,
    backgroundColor: string,
    textColor: string,
    textSize: Double,
    borderRadius: Double,
    paddingHorizontal: Double,
    paddingVertical: Double,
    maxLines: Int32
  ): void;
  setGravity(gravity: Int32): void;
  setGravityWithOffset(gravity: Int32, xOffset: Double, yOffset: Double): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeToast');
