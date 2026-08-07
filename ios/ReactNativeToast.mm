#import "ReactNativeToast.h"

@interface ReactNativeToastManager : NSObject
+ (instancetype)shared;
- (BOOL)isInitialized;
- (void)setup;
- (void)showWithMessage:(NSString *)message
               duration:(NSString *)duration
               position:(NSString *)position
                xOffset:(double)xOffset
                yOffset:(double)yOffset
        backgroundColor:(NSString *)backgroundColor
              textColor:(NSString *)textColor
               textSize:(double)textSize
           borderRadius:(double)borderRadius
      paddingHorizontal:(double)paddingHorizontal
        paddingVertical:(double)paddingVertical
               maxLines:(NSInteger)maxLines;
- (void)debugShow:(NSString *)message;
- (void)delayedShow:(NSString *)message delayMillis:(double)delayMillis;
- (void)cancel;
- (void)setDefaultStyleWithReset:(BOOL)reset
                 backgroundColor:(NSString *)backgroundColor
                       textColor:(NSString *)textColor
                        textSize:(double)textSize
                    borderRadius:(double)borderRadius
               paddingHorizontal:(double)paddingHorizontal
                 paddingVertical:(double)paddingVertical
                        maxLines:(NSInteger)maxLines;
@end

@implementation ReactNativeToast

- (NSNumber *)getIsSupported
{
  return @YES;
}

- (void)setup
{
  [[ReactNativeToastManager shared] setup];
}

- (NSNumber *)isInitialized
{
  return @([[ReactNativeToastManager shared] isInitialized]);
}

- (void)showWithOptions:(NSString *)message
               duration:(NSString *)duration
               position:(NSString *)position
                xOffset:(double)xOffset
                yOffset:(double)yOffset
        backgroundColor:(NSString *)backgroundColor
              textColor:(NSString *)textColor
               textSize:(double)textSize
           borderRadius:(double)borderRadius
      paddingHorizontal:(double)paddingHorizontal
        paddingVertical:(double)paddingVertical
               maxLines:(NSInteger)maxLines
{
  [[ReactNativeToastManager shared] showWithMessage:message
                                           duration:duration
                                           position:position
                                            xOffset:xOffset
                                            yOffset:yOffset
                                    backgroundColor:backgroundColor
                                          textColor:textColor
                                           textSize:textSize
                                       borderRadius:borderRadius
                                  paddingHorizontal:paddingHorizontal
                                    paddingVertical:paddingVertical
                                           maxLines:maxLines];
}

- (void)debugShow:(NSString *)message
{
  [[ReactNativeToastManager shared] debugShow:message];
}

- (void)delayedShow:(NSString *)message delayMillis:(double)delayMillis
{
  [[ReactNativeToastManager shared] delayedShow:message delayMillis:delayMillis];
}

- (void)showSystem:(NSString *)message
{
  [[ReactNativeToastManager shared] showWithMessage:message
                                           duration:@""
                                           position:@"bottom"
                                            xOffset:0
                                            yOffset:0
                                    backgroundColor:@""
                                          textColor:@""
                                           textSize:-1
                                       borderRadius:-1
                                  paddingHorizontal:-1
                                    paddingVertical:-1
                                           maxLines:-1];
}

- (void)cancel
{
  [[ReactNativeToastManager shared] cancel];
}

- (void)setDefaultStyle:(BOOL)reset
        backgroundColor:(NSString *)backgroundColor
              textColor:(NSString *)textColor
               textSize:(double)textSize
           borderRadius:(double)borderRadius
      paddingHorizontal:(double)paddingHorizontal
        paddingVertical:(double)paddingVertical
               maxLines:(NSInteger)maxLines
{
  [[ReactNativeToastManager shared] setDefaultStyleWithReset:reset
                                            backgroundColor:backgroundColor
                                                  textColor:textColor
                                                   textSize:textSize
                                               borderRadius:borderRadius
                                          paddingHorizontal:paddingHorizontal
                                            paddingVertical:paddingVertical
                                                   maxLines:maxLines];
}

- (void)setGravity:(NSInteger)gravity
{
  // Android compatibility API. Public callers should use semantic positions.
}

- (void)setGravityWithOffset:(NSInteger)gravity
                     xOffset:(double)xOffset
                     yOffset:(double)yOffset
{
  // Android compatibility API. Public callers should use semantic positions.
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeReactNativeToastSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"ReactNativeToast";
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
