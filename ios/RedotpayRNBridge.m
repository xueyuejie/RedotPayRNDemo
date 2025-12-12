//
//  RedotpayRNBridge.m
//  RNTest
//
//  Created for React Native Bridge
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RedotpayRNBridge, NSObject)

RCT_EXTERN_METHOD(startPay:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

