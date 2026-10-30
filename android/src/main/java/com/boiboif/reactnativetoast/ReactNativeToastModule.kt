package com.boiboif.reactnativetoast

import android.app.Activity
import android.app.Application
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.hjq.toast.ActivityToast
import com.hjq.toast.Toaster
import com.hjq.toast.config.IToast
import com.hjq.toast.config.IToastStyle

class ReactNativeToastModule(reactContext: ReactApplicationContext) :
  NativeReactNativeToastSpec(reactContext), LifecycleEventListener {

  private data class NativeToastStyle(
    val backgroundColor: String? = null,
    val textColor: String? = null,
    val textSize: Float? = null,
    val borderRadius: Float? = null,
    val paddingHorizontal: Float? = null,
    val paddingVertical: Float? = null,
    val maxLines: Int? = null,
  )

  private data class ToastRequest(
    val message: String,
    val duration: Int? = null,
    val position: String? = null,
    val xOffset: Float = 0f,
    val yOffset: Float = 0f,
    val style: NativeToastStyle? = null,
  )

  private val mainHandler = Handler(Looper.getMainLooper())
  private var lastToast: IToast? = null
  private var defaultStyle: NativeToastStyle? = null
  private var defaultGravity = Gravity.CENTER
  private var defaultXOffset = 0
  private var defaultYOffset = 0
  private var pendingRequest: ToastRequest? = null
  private var pendingExpiresAt = 0L
  private val pendingRetry = Runnable { flushPendingToast() }

  init {
    reactContext.addLifecycleEventListener(this)
  }

  override fun getIsSupported(): Boolean = true

  override fun setup() {
    runOnMain { getApplicationOrNull()?.let(::ensureInitialized) }
  }

  override fun isInitialized(): Boolean = Toaster.isInit()

  override fun showWithOptions(
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
    maxLines: Double,
  ) {
    enqueue(
      ToastRequest(
        message = message,
        duration = when (duration) {
          "short" -> Toast.LENGTH_SHORT
          "long" -> Toast.LENGTH_LONG
          else -> null
        },
        position = position.ifEmpty { null },
        xOffset = xOffset.toFloat(),
        yOffset = yOffset.toFloat(),
        style = decodeStyle(
          backgroundColor,
          textColor,
          textSize,
          borderRadius,
          paddingHorizontal,
          paddingVertical,
          maxLines,
        ),
      )
    )
  }

  override fun debugShow(message: String) {
    val application = getApplicationOrNull() ?: return
    val isDebuggable =
      (application.applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
    if (isDebuggable) enqueue(ToastRequest(message))
  }

  override fun delayedShow(message: String, delayMillis: Double) {
    runOnMain {
      mainHandler.postDelayed(
        { enqueue(ToastRequest(message)) },
        delayMillis.coerceAtLeast(0.0).toLong(),
      )
    }
  }

  override fun showSystem(message: String) {
    runOnMain {
      val application = getApplicationOrNull() ?: return@runOnMain
      ensureInitialized(application)
      cancelCurrentToast()
      Toaster.show(message)
    }
  }

  override fun cancel() {
    runOnMain {
      pendingRequest = null
      mainHandler.removeCallbacks(pendingRetry)
      cancelCurrentToast()
    }
  }

  override fun setDefaultStyle(
    reset: Boolean,
    backgroundColor: String,
    textColor: String,
    textSize: Double,
    borderRadius: Double,
    paddingHorizontal: Double,
    paddingVertical: Double,
    maxLines: Double,
  ) {
    val style = if (reset) {
      null
    } else {
      decodeStyle(
        backgroundColor,
        textColor,
        textSize,
        borderRadius,
        paddingHorizontal,
        paddingVertical,
        maxLines,
      )
    }
    runOnMain { defaultStyle = style }
  }

  override fun setGravity(gravity: Double) {
    runOnMain {
      defaultGravity = gravity.toInt()
      defaultXOffset = 0
      defaultYOffset = 0
      getApplicationOrNull()?.let {
        ensureInitialized(it)
        Toaster.setGravity(defaultGravity)
      }
    }
  }

  override fun setGravityWithOffset(gravity: Double, xOffset: Double, yOffset: Double) {
    runOnMain {
      defaultGravity = gravity.toInt()
      defaultXOffset = xOffset.toInt()
      defaultYOffset = yOffset.toInt()
      getApplicationOrNull()?.let {
        ensureInitialized(it)
        Toaster.setGravity(defaultGravity, defaultXOffset, defaultYOffset)
      }
    }
  }

  override fun onHostResume() {
    runOnMain(::flushPendingToast)
  }

  override fun onHostPause() = Unit

  override fun onHostDestroy() {
    runOnMain(::cancelCurrentToast)
  }

  override fun invalidate() {
    reactApplicationContext.removeLifecycleEventListener(this)
    runOnMain {
      pendingRequest = null
      mainHandler.removeCallbacksAndMessages(null)
      cancelCurrentToast()
    }
    super.invalidate()
  }

  private fun enqueue(request: ToastRequest) {
    runOnMain {
      pendingRequest = null
      mainHandler.removeCallbacks(pendingRetry)
      showOrQueue(request)
    }
  }

  private fun showOrQueue(request: ToastRequest) {
    val application = getApplicationOrNull()
    val activity = getActiveActivityOrNull()
    if (application == null || activity == null) {
      queuePendingToast(request)
      return
    }

    ensureInitialized(application)
    showActivityToast(application, activity, request)
  }

  private fun queuePendingToast(request: ToastRequest) {
    pendingRequest = request
    pendingExpiresAt = SystemClock.uptimeMillis() + PENDING_TOAST_TIMEOUT_MS
    schedulePendingRetry()
  }

  private fun flushPendingToast() {
    val request = pendingRequest ?: return
    val application = getApplicationOrNull()
    val activity = getActiveActivityOrNull()
    if (application == null || activity == null) {
      if (SystemClock.uptimeMillis() >= pendingExpiresAt) {
        pendingRequest = null
      } else {
        schedulePendingRetry()
      }
      return
    }

    pendingRequest = null
    ensureInitialized(application)
    showActivityToast(application, activity, request)
  }

  private fun schedulePendingRetry() {
    mainHandler.removeCallbacks(pendingRetry)
    mainHandler.postDelayed(pendingRetry, PENDING_TOAST_RETRY_MS)
  }

  private fun showActivityToast(
    application: Application,
    activity: Activity,
    request: ToastRequest,
  ) {
    cancelCurrentToast()

    val fallbackStyle = runCatching { Toaster.getStyle() }.getOrNull()
    val toast = ActivityToast(activity)
    toast.setView(createToastView(application, mergeStyles(defaultStyle, request.style), fallbackStyle))

    val gravity = resolveGravity(request.position)
    val xOffset = if (request.position == null) defaultXOffset else dp(application, request.xOffset)
    val yOffset = resolveYOffset(application, request.position, request.yOffset)
    toast.setGravity(gravity, xOffset, yOffset)
    toast.setMargin(0f, 0f)
    toast.setDuration(
      request.duration ?: if (request.message.length > 20) Toast.LENGTH_LONG else Toast.LENGTH_SHORT
    )
    toast.setText(request.message)

    lastToast = toast
    toast.show()
  }

  private fun cancelCurrentToast() {
    runCatching { lastToast?.cancel() }
    lastToast = null
    runCatching { Toaster.cancel() }
  }

  private fun ensureInitialized(application: Application) {
    if (!Toaster.isInit()) Toaster.init(application)
  }

  private fun runOnMain(block: () -> Unit) {
    if (Looper.myLooper() == Looper.getMainLooper()) block() else mainHandler.post(block)
  }

  private fun getApplicationOrNull(): Application? =
    reactApplicationContext.applicationContext as? Application

  private fun getActiveActivityOrNull(): Activity? =
    reactApplicationContext.currentActivity?.takeIf { !it.isFinishing && !it.isDestroyed }

  private fun decodeStyle(
    backgroundColor: String,
    textColor: String,
    textSize: Double,
    borderRadius: Double,
    paddingHorizontal: Double,
    paddingVertical: Double,
    maxLines: Double,
  ): NativeToastStyle? {
    val style = NativeToastStyle(
      backgroundColor = backgroundColor.ifEmpty { null },
      textColor = textColor.ifEmpty { null },
      textSize = textSize.takeIf { it >= 0 }?.toFloat(),
      borderRadius = borderRadius.takeIf { it >= 0 }?.toFloat(),
      paddingHorizontal = paddingHorizontal.takeIf { it >= 0 }?.toFloat(),
      paddingVertical = paddingVertical.takeIf { it >= 0 }?.toFloat(),
      maxLines = maxLines.takeIf { it >= 0 }?.toInt(),
    )
    return style.takeUnless { it == NativeToastStyle() }
  }

  private fun mergeStyles(
    base: NativeToastStyle?,
    override: NativeToastStyle?,
  ): NativeToastStyle? = when {
    base == null -> override
    override == null -> base
    else -> NativeToastStyle(
      backgroundColor = override.backgroundColor ?: base.backgroundColor,
      textColor = override.textColor ?: base.textColor,
      textSize = override.textSize ?: base.textSize,
      borderRadius = override.borderRadius ?: base.borderRadius,
      paddingHorizontal = override.paddingHorizontal ?: base.paddingHorizontal,
      paddingVertical = override.paddingVertical ?: base.paddingVertical,
      maxLines = override.maxLines ?: base.maxLines,
    )
  }

  private fun resolveGravity(position: String?): Int = when (position) {
    "top" -> Gravity.TOP or Gravity.CENTER_HORIZONTAL
    "bottom" -> Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    "center" -> Gravity.CENTER
    else -> defaultGravity
  }

  private fun resolveYOffset(application: Application, position: String?, yOffset: Float): Int =
    when (position) {
      "top" -> dp(application, if (yOffset == 0f) 16f else yOffset)
      "bottom" -> dp(application, if (yOffset == 0f) 48f else yOffset)
      "center" -> dp(application, yOffset) - getStatusBarHeight(application) / 2
      else -> defaultYOffset
    }

  private fun createToastView(
    context: Application,
    style: NativeToastStyle?,
    fallbackStyle: IToastStyle<*>?,
  ): View {
    if (style == null) {
      fallbackStyle?.createView(context)?.let { return it }
    }

    return TextView(context).apply {
      id = android.R.id.message
      layoutParams = ViewGroup.LayoutParams(
        ViewGroup.LayoutParams.WRAP_CONTENT,
        ViewGroup.LayoutParams.WRAP_CONTENT,
      )
      gravity = Gravity.CENTER
      setTextColor(parseColor(style?.textColor) ?: Color.WHITE)
      setTextSize(TypedValue.COMPLEX_UNIT_SP, style?.textSize ?: 14f)
      maxLines = style?.maxLines ?: 2
      setPadding(
        dp(context, style?.paddingHorizontal ?: 16f),
        dp(context, style?.paddingVertical ?: 10f),
        dp(context, style?.paddingHorizontal ?: 16f),
        dp(context, style?.paddingVertical ?: 10f),
      )
      background = GradientDrawable().apply {
        setColor(parseColor(style?.backgroundColor) ?: 0xB3000000.toInt())
        cornerRadius = dp(context, style?.borderRadius ?: 10f).toFloat()
      }
    }
  }

  private fun parseColor(value: String?): Int? =
    value?.let { runCatching { Color.parseColor(it) }.getOrNull() }

  private fun dp(context: Application, value: Float): Int = TypedValue.applyDimension(
    TypedValue.COMPLEX_UNIT_DIP,
    value,
    context.resources.displayMetrics,
  ).toInt()

  private fun getStatusBarHeight(context: Application): Int {
    val resourceId = context.resources.getIdentifier("status_bar_height", "dimen", "android")
    return if (resourceId > 0) context.resources.getDimensionPixelSize(resourceId) else 0
  }

  companion object {
    const val NAME = NativeReactNativeToastSpec.NAME
    private const val PENDING_TOAST_RETRY_MS = 100L
    private const val PENDING_TOAST_TIMEOUT_MS = 1_500L
  }
}
