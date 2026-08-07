import UIKit

struct ToastStyle {
  var backgroundColor = UIColor(white: 0, alpha: 0.8)
  var textColor = UIColor.white
  var textSize: CGFloat = 14
  var borderRadius: CGFloat = 10
  var paddingHorizontal: CGFloat = 16
  var paddingVertical: CGFloat = 10
  var maxLines = 2
}

enum ToastPosition {
  case top
  case center
  case bottom
}

enum ToastDuration {
  case short
  case long

  var timeInterval: TimeInterval {
    switch self {
    case .short:
      return 2
    case .long:
      return 3.5
    }
  }
}

final class ToastView: UIView {
  private let messageLabel = UILabel()
  private var hideTimer: Timer?
  private var hideCompletion: (() -> Void)?

  init(message: String, style: ToastStyle) {
    super.init(frame: .zero)
    setupView(message: message, style: style)
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func setupView(message: String, style: ToastStyle) {
    backgroundColor = style.backgroundColor
    layer.cornerRadius = style.borderRadius
    layer.masksToBounds = true

    messageLabel.text = message
    messageLabel.textColor = style.textColor
    messageLabel.font = .systemFont(ofSize: style.textSize)
    messageLabel.textAlignment = .center
    messageLabel.numberOfLines = style.maxLines
    messageLabel.lineBreakMode = .byTruncatingTail

    addSubview(messageLabel)
    messageLabel.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      messageLabel.topAnchor.constraint(equalTo: topAnchor, constant: style.paddingVertical),
      messageLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: style.paddingHorizontal),
      messageLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -style.paddingHorizontal),
      messageLabel.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -style.paddingVertical),
    ])
  }

  func show(
    in window: UIWindow,
    position: ToastPosition,
    xOffset: CGFloat,
    yOffset: CGFloat,
    duration: ToastDuration,
    completion: @escaping () -> Void
  ) {
    hideCompletion = completion
    window.addSubview(self)
    translatesAutoresizingMaskIntoConstraints = false

    let positionConstraint: NSLayoutConstraint
    switch position {
    case .top:
      positionConstraint = topAnchor.constraint(
        equalTo: window.safeAreaLayoutGuide.topAnchor,
        constant: yOffset == 0 ? 16 : yOffset
      )
    case .center:
      positionConstraint = centerYAnchor.constraint(
        equalTo: window.centerYAnchor,
        constant: yOffset
      )
    case .bottom:
      positionConstraint = bottomAnchor.constraint(
        equalTo: window.safeAreaLayoutGuide.bottomAnchor,
        constant: yOffset == 0 ? -48 : -yOffset
      )
    }

    NSLayoutConstraint.activate([
      centerXAnchor.constraint(equalTo: window.centerXAnchor, constant: xOffset),
      positionConstraint,
      leadingAnchor.constraint(greaterThanOrEqualTo: window.leadingAnchor, constant: 16),
      trailingAnchor.constraint(lessThanOrEqualTo: window.trailingAnchor, constant: -16),
    ])

    alpha = 0
    transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
    UIView.animate(
      withDuration: 0.3,
      delay: 0,
      usingSpringWithDamping: 0.7,
      initialSpringVelocity: 0.5,
      options: [.curveEaseOut, .allowUserInteraction]
    ) {
      self.alpha = 1
      self.transform = .identity
    }

    let timer = Timer(timeInterval: duration.timeInterval, repeats: false) { [weak self] timer in
      timer.invalidate()
      self?.hide(animated: true)
    }
    RunLoop.main.add(timer, forMode: .common)
    hideTimer = timer
  }

  func hide(animated: Bool) {
    hideTimer?.invalidate()
    hideTimer = nil

    let completion = {
      self.removeFromSuperview()
      self.hideCompletion?()
      self.hideCompletion = nil
    }

    guard animated else {
      completion()
      return
    }

    UIView.animate(
      withDuration: 0.2,
      animations: {
        self.alpha = 0
        self.transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
      },
      completion: { _ in completion() }
    )
  }

  deinit {
    hideTimer?.invalidate()
  }
}

