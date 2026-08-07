import UIKit

private struct ToastStyleOverride {
  var backgroundColor: UIColor?
  var textColor: UIColor?
  var textSize: CGFloat?
  var borderRadius: CGFloat?
  var paddingHorizontal: CGFloat?
  var paddingVertical: CGFloat?
  var maxLines: Int?
}

@objc(ReactNativeToastManager)
final class ReactNativeToastManager: NSObject {
  private struct ToastRequest {
    let message: String
    let duration: ToastDuration?
    let position: ToastPosition
    let xOffset: CGFloat
    let yOffset: CGFloat
    let style: ToastStyleOverride?
  }

  @objc static let shared = ReactNativeToastManager()

  private var currentToast: ToastView?
  private var defaultStyle = ToastStyle()
  private weak var cachedWindow: UIWindow?
  private var pendingRequest: ToastRequest?
  private var pendingExpiresAt: Date?
  private var pendingRetry: DispatchWorkItem?

  private override init() {
    super.init()
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(applicationDidBecomeActive),
      name: UIApplication.didBecomeActiveNotification,
      object: nil
    )
  }

  @objc(setup)
  func setup() {}

  @objc(isInitialized)
  func isInitialized() -> Bool {
    true
  }

  @objc(showWithMessage:duration:position:xOffset:yOffset:backgroundColor:textColor:textSize:borderRadius:paddingHorizontal:paddingVertical:maxLines:)
  func show(
    message: String,
    duration: String,
    position: String,
    xOffset: Double,
    yOffset: Double,
    backgroundColor: String,
    textColor: String,
    textSize: Double,
    borderRadius: Double,
    paddingHorizontal: Double,
    paddingVertical: Double,
    maxLines: Int
  ) {
    let request = ToastRequest(
      message: message,
      duration: duration == "short" ? .short : duration == "long" ? .long : nil,
      position: position == "top" ? .top : position == "center" ? .center : .bottom,
      xOffset: CGFloat(xOffset),
      yOffset: CGFloat(yOffset),
      style: decodeStyle(
        backgroundColor: backgroundColor,
        textColor: textColor,
        textSize: textSize,
        borderRadius: borderRadius,
        paddingHorizontal: paddingHorizontal,
        paddingVertical: paddingVertical,
        maxLines: maxLines
      )
    )
    enqueue(request, delay: 0)
  }

  @objc(debugShow:)
  func debugShow(_ message: String) {
    #if DEBUG
      enqueue(defaultRequest(message), delay: 0)
    #endif
  }

  @objc(delayedShow:delayMillis:)
  func delayedShow(_ message: String, delayMillis: Double) {
    enqueue(defaultRequest(message), delay: max(0, delayMillis / 1000))
  }

  @objc(cancel)
  func cancel() {
    performOnMain {
      self.pendingRequest = nil
      self.pendingExpiresAt = nil
      self.pendingRetry?.cancel()
      self.pendingRetry = nil
      self.currentToast?.hide(animated: true)
      self.currentToast = nil
    }
  }

  @objc(setDefaultStyleWithReset:backgroundColor:textColor:textSize:borderRadius:paddingHorizontal:paddingVertical:maxLines:)
  func setDefaultStyle(
    reset: Bool,
    backgroundColor: String,
    textColor: String,
    textSize: Double,
    borderRadius: Double,
    paddingHorizontal: Double,
    paddingVertical: Double,
    maxLines: Int
  ) {
    performOnMain {
      self.defaultStyle = ToastStyle()
      guard !reset else { return }
      let values = self.decodeStyle(
        backgroundColor: backgroundColor,
        textColor: textColor,
        textSize: textSize,
        borderRadius: borderRadius,
        paddingHorizontal: paddingHorizontal,
        paddingVertical: paddingVertical,
        maxLines: maxLines
      )
      self.apply(values, to: &self.defaultStyle)
    }
  }

  @objc private func applicationDidBecomeActive() {
    flushPendingToast()
  }

  private func defaultRequest(_ message: String) -> ToastRequest {
    ToastRequest(
      message: message,
      duration: nil,
      position: .bottom,
      xOffset: 0,
      yOffset: 0,
      style: nil
    )
  }

  private func enqueue(_ request: ToastRequest, delay: TimeInterval) {
    performOnMain {
      if delay > 0 {
        DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
          self.enqueueOnMain(request)
        }
      } else {
        self.enqueueOnMain(request)
      }
    }
  }

  private func enqueueOnMain(_ request: ToastRequest) {
    pendingRequest = nil
    pendingExpiresAt = nil
    pendingRetry?.cancel()
    pendingRetry = nil

    guard let window = currentWindow() else {
      pendingRequest = request
      pendingExpiresAt = Date().addingTimeInterval(Self.pendingToastTimeout)
      schedulePendingRetry()
      return
    }
    show(request, in: window)
  }

  private func flushPendingToast() {
    performOnMain {
      guard let request = self.pendingRequest else { return }
      guard let expiresAt = self.pendingExpiresAt, Date() < expiresAt else {
        self.pendingRequest = nil
        self.pendingExpiresAt = nil
        return
      }
      guard let window = self.currentWindow() else {
        self.schedulePendingRetry()
        return
      }

      self.pendingRequest = nil
      self.pendingExpiresAt = nil
      self.pendingRetry?.cancel()
      self.pendingRetry = nil
      self.show(request, in: window)
    }
  }

  private func schedulePendingRetry() {
    pendingRetry?.cancel()
    let workItem = DispatchWorkItem { [weak self] in self?.flushPendingToast() }
    pendingRetry = workItem
    DispatchQueue.main.asyncAfter(
      deadline: .now() + Self.pendingToastRetryDelay,
      execute: workItem
    )
  }

  private func show(_ request: ToastRequest, in window: UIWindow) {
    currentToast?.hide(animated: false)
    currentToast = nil

    let duration = request.duration ?? (request.message.count > 20 ? .long : .short)
    let toast = ToastView(message: request.message, style: resolvedStyle(request.style))
    currentToast = toast
    toast.show(
      in: window,
      position: request.position,
      xOffset: request.xOffset,
      yOffset: request.yOffset,
      duration: duration
    ) { [weak self, weak toast] in
      guard let self, let toast, self.currentToast === toast else { return }
      self.currentToast = nil
    }
  }

  private func resolvedStyle(_ override: ToastStyleOverride?) -> ToastStyle {
    var style = defaultStyle
    apply(override, to: &style)
    return style
  }

  private func apply(_ values: ToastStyleOverride?, to style: inout ToastStyle) {
    guard let values else { return }
    if let value = values.backgroundColor { style.backgroundColor = value }
    if let value = values.textColor { style.textColor = value }
    if let value = values.textSize { style.textSize = value }
    if let value = values.borderRadius { style.borderRadius = value }
    if let value = values.paddingHorizontal { style.paddingHorizontal = value }
    if let value = values.paddingVertical { style.paddingVertical = value }
    if let value = values.maxLines { style.maxLines = value }
  }

  private func decodeStyle(
    backgroundColor: String,
    textColor: String,
    textSize: Double,
    borderRadius: Double,
    paddingHorizontal: Double,
    paddingVertical: Double,
    maxLines: Int
  ) -> ToastStyleOverride? {
    let style = ToastStyleOverride(
      backgroundColor: parseColor(backgroundColor),
      textColor: parseColor(textColor),
      textSize: textSize >= 0 ? CGFloat(textSize) : nil,
      borderRadius: borderRadius >= 0 ? CGFloat(borderRadius) : nil,
      paddingHorizontal: paddingHorizontal >= 0 ? CGFloat(paddingHorizontal) : nil,
      paddingVertical: paddingVertical >= 0 ? CGFloat(paddingVertical) : nil,
      maxLines: maxLines >= 0 ? maxLines : nil
    )
    if style.backgroundColor == nil,
       style.textColor == nil,
       style.textSize == nil,
       style.borderRadius == nil,
       style.paddingHorizontal == nil,
       style.paddingVertical == nil,
       style.maxLines == nil {
      return nil
    }
    return style
  }

  private func currentWindow() -> UIWindow? {
    if let cachedWindow,
       cachedWindow.windowScene?.activationState == .foregroundActive {
      return cachedWindow
    }

    let activeScene = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .first { $0.activationState == .foregroundActive }
    let window = activeScene?.windows.first { $0.isKeyWindow } ?? activeScene?.windows.first
    cachedWindow = window
    return window
  }

  private func parseColor(_ value: String) -> UIColor? {
    let hex = value.trimmingCharacters(in: .whitespacesAndNewlines)
      .replacingOccurrences(of: "#", with: "")
    guard hex.count == 6 || hex.count == 8,
          let color = UInt64(hex, radix: 16) else {
      return nil
    }

    return UIColor(
      red: CGFloat((color >> 16) & 0xFF) / 255,
      green: CGFloat((color >> 8) & 0xFF) / 255,
      blue: CGFloat(color & 0xFF) / 255,
      alpha: hex.count == 8 ? CGFloat((color >> 24) & 0xFF) / 255 : 1
    )
  }

  private func performOnMain(_ action: @escaping () -> Void) {
    if Thread.isMainThread {
      action()
    } else {
      DispatchQueue.main.async(execute: action)
    }
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  private static let pendingToastRetryDelay: TimeInterval = 0.1
  private static let pendingToastTimeout: TimeInterval = 1.5
}
