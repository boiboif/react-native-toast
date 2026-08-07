export type ToastPosition = 'top' | 'center' | 'bottom';

export type ToastDuration = 'short' | 'long';

export type ToastStyleOptions = {
  backgroundColor?: string | number;
  textColor?: string | number;
  textSize?: number;
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  maxLines?: number;
};

export type ToastOptions = {
  duration?: ToastDuration;
  position?: ToastPosition;
  xOffset?: number;
  yOffset?: number;
  style?: ToastStyleOptions;
};

export type ToastPreset = 'success' | 'error' | 'info' | 'warning';

export type ToastConfig = {
  defaultOptions?: ToastOptions;
  presetStyles?: Partial<Record<ToastPreset, ToastStyleOptions>>;
};
