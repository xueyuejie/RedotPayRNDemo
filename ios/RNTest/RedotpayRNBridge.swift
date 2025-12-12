//
//  RedotpayRNBridge.swift
//  RNTest
//
//  Created for React Native Bridge
//
import Foundation
import React
import RedotPaySDK

/// React Native 桥接类
/// 提供与 RedotPayCollection 相同的接口方法
/// 
/// 使用说明：
/// 1. 在 React Native 项目中导入此模块
/// 2. 调用 startPay 方法，传入配置参数
/// 3. 方法返回 Promise，成功时返回 {"success": true}，失败时返回错误信息
@objc(RedotpayRNBridge)
class RedotpayRNBridge: NSObject, RCTBridgeModule {
    
    /// 模块初始化，确保在主队列上执行
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    /// 模块名称，React Native 中通过此名称访问
    static func moduleName() -> String! {
        return "RedotpayRNBridge"
    }
    
    /// 导出 startPay 方法给 React Native
    /// 
    /// 参数说明：
    /// - config: 配置字典，必须包含以下键值：
    ///   - preOrderId: String - 预订单ID
    ///   - jwtToken: String - JWT令牌
    ///   - publicKey: String - 公钥
    ///   - language: String - 语言代码
    /// 
    /// 返回值：
    /// - Promise: 成功时 resolve({"success": true})，失败时 reject(error)
    @objc
    func startPay(_ config: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        // 在主线程执行
        DispatchQueue.main.async {
            // 解析配置参数
            guard let preOrderId = config["preOrderId"] as? String,
                  let jwtToken = config["jwtToken"] as? String,
                  let publicKey = config["publicKey"] as? String,
                  let language = config["language"] as? String else {
                rejecter("INVALID_PARAMS", "缺少必需的参数: preOrderId, jwtToken, publicKey, language", nil)
                return
            }
            
            // 创建 SDKConfiguartion 对象
            let sdkConfig = SDKConfiguartion(
                preOrderId: preOrderId,
                jwtToken: jwtToken,
                publicKey: publicKey,
                language: language
            )
            
            // 调用原始方法
            let result = RedotPayCollection.startPay(sdkConfig: sdkConfig)
            
            // 返回结果
            if result {
                resolver(["success": true])
            } else {
                rejecter("START_PAY_FAILED", "启动支付失败", nil)
            }
        }
    }
}

