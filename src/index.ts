import NativeReactNativeToast from './specs/NativeReactNativeToast';

import type {
  ToastConfig,
  ToastOptions,
  ToastPreset,
  ToastStyleOptions,
} from './types';

export type {
  ToastConfig,
  ToastDuration,
  ToastOptions,
  ToastPosition,
  ToastPreset,
  ToastStyleOptions,
} from './types';

const UNSET_NUMBER = -1;

const config: Required<ToastConfig> = {
  defaultOptions: {
    duration: 'short',
    position: 'bottom',
    xOffset: 0,
    yOffset: 0,
    style: {
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
  },
  presetStyles: {
    success: { backgroundColor: '#52C41A' },
    error: { backgroundColor: '#FF4D4F' },
    warning: { backgroundColor: '#FAAD14' },
    info: { backgroundColor: '#1890FF' },
  },
};

const mergeStyles = (
  ...styles: Array<ToastStyleOptions | undefined>
): ToastStyleOptions | undefined => {
  const merged = Object.assign(
    {},
    ...styles.filter((style): style is ToastStyleOptions => style != null)
  );

  return Object.keys(merged).length > 0 ? merged : undefined;
};

const buildOptions = (
  options?: ToastOptions,
  preset?: ToastPreset
): ToastOptions => {
  const { style: defaultStyle, ...defaultOptions } = config.defaultOptions;
  const { style: optionStyle, ...optionValues } = options ?? {};
  const style = mergeStyles(
    defaultStyle,
    preset ? config.presetStyles[preset] : undefined,
    optionStyle
  );

  return {
    ...defaultOptions,
    ...optionValues,
    ...(style ? { style } : {}),
  };
};

const encodeColor = (color: string | number | undefined): string => {
  if (typeof color === 'string') {
    return color;
  }

  if (typeof color === 'number') {
    const integer = Math.trunc(color);
    const unsigned = ((integer % 0x100000000) + 0x100000000) % 0x100000000;
    return `#${unsigned.toString(16).padStart(8, '0')}`;
  }

  return '';
};

const callNativeShow = (message: string, options?: ToastOptions): void => {
  const style = options?.style;

  NativeReactNativeToast.showWithOptions(
    message,
    options?.duration ?? '',
    options?.position ?? '',
    options?.xOffset ?? 0,
    options?.yOffset ?? 0,
    encodeColor(style?.backgroundColor),
    encodeColor(style?.textColor),
    style?.textSize ?? UNSET_NUMBER,
    style?.borderRadius ?? UNSET_NUMBER,
    style?.paddingHorizontal ?? UNSET_NUMBER,
    style?.paddingVertical ?? UNSET_NUMBER,
    style?.maxLines ?? UNSET_NUMBER
  );
};

const show = (message: string, options?: ToastOptions): void => {
  callNativeShow(message, buildOptions(options));
};

const showPreset =
  (preset: ToastPreset) =>
  (message: string, options?: ToastOptions): void => {
    callNativeShow(message, buildOptions(options, preset));
  };

const hide = (): void => {
  NativeReactNativeToast.cancel();
};

const configure = (partial: ToastConfig): void => {
  if (partial.defaultOptions) {
    config.defaultOptions = {
      ...config.defaultOptions,
      ...partial.defaultOptions,
    };

    if (Object.prototype.hasOwnProperty.call(partial.defaultOptions, 'style')) {
      const style = partial.defaultOptions.style;
      NativeReactNativeToast.setDefaultStyle(
        style == null,
        encodeColor(style?.backgroundColor),
        encodeColor(style?.textColor),
        style?.textSize ?? UNSET_NUMBER,
        style?.borderRadius ?? UNSET_NUMBER,
        style?.paddingHorizontal ?? UNSET_NUMBER,
        style?.paddingVertical ?? UNSET_NUMBER,
        style?.maxLines ?? UNSET_NUMBER
      );
    }
  }

  if (partial.presetStyles) {
    config.presetStyles = {
      ...config.presetStyles,
      ...partial.presetStyles,
    };
  }
};

const showSystem = (message: string): void => {
  NativeReactNativeToast.showSystem(message);
};

export const Native = {
  get isSupported(): boolean {
    return NativeReactNativeToast.getIsSupported();
  },
  init: (): void => NativeReactNativeToast.setup(),
  isInit: (): boolean => NativeReactNativeToast.isInitialized(),
  show: (message: string): void => callNativeShow(message),
  showWithOptions: callNativeShow,
  showShort: (message: string): void =>
    callNativeShow(message, { duration: 'short' }),
  showLong: (message: string): void =>
    callNativeShow(message, { duration: 'long' }),
  debugShow: (message: string): void =>
    NativeReactNativeToast.debugShow(message),
  delayedShow: (message: string, delayMillis: number): void =>
    NativeReactNativeToast.delayedShow(message, Math.max(0, delayMillis)),
  showSystem,
  cancel: hide,
  setDefaultStyle: (style: ToastStyleOptions | null): void =>
    NativeReactNativeToast.setDefaultStyle(
      style == null,
      encodeColor(style?.backgroundColor),
      encodeColor(style?.textColor),
      style?.textSize ?? UNSET_NUMBER,
      style?.borderRadius ?? UNSET_NUMBER,
      style?.paddingHorizontal ?? UNSET_NUMBER,
      style?.paddingVertical ?? UNSET_NUMBER,
      style?.maxLines ?? UNSET_NUMBER
    ),
  setGravity: (gravity: number): void =>
    NativeReactNativeToast.setGravity(gravity),
  setGravityWithOffset: (
    gravity: number,
    xOffset: number,
    yOffset: number
  ): void =>
    NativeReactNativeToast.setGravityWithOffset(gravity, xOffset, yOffset),
} as const;

export const Toast = {
  show,
  success: showPreset('success'),
  error: showPreset('error'),
  warning: showPreset('warning'),
  info: showPreset('info'),
  hide,
  config: configure,
  showSystem,
  Native,
} as const;

export default Toast;
