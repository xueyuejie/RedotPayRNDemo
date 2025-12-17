//
//  RedotpayRNBridge.swift
//  RNTest
//
//  Created for React Native Bridge
//
import Foundation
import React
import RedotPaySDK

/// React Native bridge class
/// Provides the same interface methods as RedotPayCollection
///
/// Usage:
/// 1. Import this module in the React Native project
/// 2. Call the startPay method with configuration parameters
/// 3. The method returns a Promise. On success, it returns {"success": true}; on failure, it returns error information
@objc(RedotpayRNBridge)
class RedotpayRNBridge: NSObject, RCTBridgeModule {
    
    /// Module initialization, ensure execution on the main queue
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    /// Module name, accessed in React Native using this name
    static func moduleName() -> String! {
        return "RedotpayRNBridge"
    }
    
    /// Export the startPay method to React Native
    ///
    /// Parameters:
    /// - config: Configuration dictionary, must include the following keys:
    ///   - preOrderId: String - Pre-order ID
    ///   - jwtToken: String - JWT token
    ///   - publicKey: String - Public key
    ///   - language: String - Language code
    ///   - isTest: Bool - Flag indicating whether the environment is test or production.
    ///
    /// Return:
    /// - Promise: resolves with {"success": true} on success, rejects with error on failure
    @objc
    func startPay(_ config: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        // Execute on the main thread
        DispatchQueue.main.async {
            // Parse configuration parameters
            guard let preOrderId = config["preOrderId"] as? String,
                  let jwtToken = config["jwtToken"] as? String,
                  let publicKey = config["publicKey"] as? String,
                  let language = config["language"] as? String,
                  let isTest = config["isTest"] as? Bool else {
                rejecter("INVALID_PARAMS", "Missing required parameters: preOrderId, jwtToken, publicKey, language, isTest", nil)
                return
            }
            
            // Create SDKConfiguration object
            let sdkConfig = SDKConfiguartion(
                preOrderId: preOrderId,
                jwtToken: jwtToken,
                publicKey: publicKey,
                language: language,
                isTest: isTest
            )
            
            // Call the original method
            let result = RedotPayCollection.startPay(sdkConfig: sdkConfig)
            
            // Return result
            if result {
                resolver(["success": true])
            } else {
                rejecter("START_PAY_FAILED", "Failed to start payment", nil)
            }
        }
    }
}
