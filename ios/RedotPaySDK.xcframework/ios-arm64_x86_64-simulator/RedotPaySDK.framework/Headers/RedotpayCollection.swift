import Foundation
import SwiftUI

/// RedotPayCollection主接口类
public class RedotPayCollection {
    public static func startPay(sdkConfig: SDKConfiguartion) -> Bool {
        Task {
            FontLoader.registerFonts()
        }
        IsTestConfig.share.isTest = sdkConfig.isTest
        LanguageManager.shared.setLanguage(language: sdkConfig.language)
        return createPaymentViewController(presn: sdkConfig.preOrderId, publicKey: sdkConfig.publicKey, jwtToken: sdkConfig.jwtToken)
    }
    // MARK: - 公共方法
    /// 创建支付视图控制器
    /// - Returns: 支付视图控制器
    static func createPaymentViewController(presn: String, publicKey: String, jwtToken: String) -> Bool {
        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = scene.windows.first,
           let rootViewController = window.rootViewController else {
            return false
        }
        let router = RedotPayRouter(preSn: presn, publicKey: publicKey, jwtToken: jwtToken)
        let hostingController = UIHostingController(rootView: RouterContainerView(router: router))
        hostingController.modalPresentationStyle = .fullScreen
        rootViewController.present(hostingController, animated: true)
        router.onModuleDismiss = {
            Task {
                await MainActor.run {
                    hostingController.dismiss(animated: true)
                }
            }
        }
        return true
    }
}
