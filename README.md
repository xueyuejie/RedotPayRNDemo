# RedotPay React Native iOS Integration Guide

This document explains how to integrate RedotPaySDK.xcframework into a React Native project and configure the bridge files.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Integration Steps](#integration-steps)
  - [1. Add RedotPaySDK.xcframework](#1-add-redotpaysdkxcframework)
  - [2. Configure Bridge Files](#2-configure-bridge-files)
  - [3. Configure Xcode Project](#3-configure-xcode-project)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- React Native 0.82.1 or higher
- Xcode 14.0 or higher
- iOS 14.0 or higher

## Integration Steps

### 1. Add RedotPaySDK.xcframework

#### Method 1: Download from GitHub

Download `RedotPaySDK.xcframework` from [RedotPayRNDemo](https://github.com/xueyuejie/RedotPayRNDemo/tree/main/ios) and place it in the `ios` directory of your project:

```
ios/
  └── RedotPaySDK.xcframework/
      ├── Info.plist
      ├── ios-arm64/
      └── ios-arm64_x86_64-simulator/
```

#### Method 2: Use Existing (if already present)

If the `ios/RedotPaySDK.xcframework` directory already exists in your project, skip this step.

### 2. Configure Bridge Files

Refer to the bridge file implementations in the [RedotPayRNDemo](https://github.com/xueyuejie/RedotPayRNDemo/tree/main/ios) project:

#### 2.1 Create Objective-C Bridge File

Create the `RedotpayRNBridge.m` file in the `ios` directory, referencing the `RedotpayRNBridge.m` file from the GitHub project.

#### 2.2 Create Swift Bridge Implementation File

Create the `RedotpayRNBridge.swift` file in the `ios` directory, referencing the `RedotpayRNBridge.swift` file from the GitHub project.

#### 2.3 Configure Bridging Header

Ensure the `ios/RNTest/RNTest-Bridging-Header.h` file contains React Native header file references.

### 3. Configure Xcode Project

#### 3.1 Add Framework to Project

1. Open the Xcode project (use `ios/RNTest.xcworkspace`, not `.xcodeproj`)
2. In the project navigator, select the project root node
3. Select the `RNTest` target
4. Go to the `General` tab
5. In the `Frameworks, Libraries, and Embedded Content` section, click the `+` button
6. Click `Add Other...` -> `Add Files...`
7. Select `ios/RedotPaySDK.xcframework`
8. Ensure it is set to `Embed & Sign`

#### 3.2 Configure Build Settings

1. In Xcode, select the `RNTest` target
2. Go to the `Build Settings` tab
3. Search for `Framework Search Paths`
4. Ensure it includes `$(SRCROOT)/RedotPaySDK.xcframework` or the relative path

#### 3.3 Add Bridge Files to Project

1. Ensure the `RedotpayRNBridge.m` and `RedotpayRNBridge.swift` files are added to the Xcode project
2. In `Build Settings`, search for `Objective-C Bridging Header`
3. Set it to `$(SRCROOT)/RNTest/RNTest-Bridging-Header.h` (or your actual path)

#### 3.4 Configure Swift Compilation Settings

1. In `Build Settings`, search for `Swift Language Version`
2. Ensure it is set to an appropriate Swift version (typically Swift 5)

After completion, open `RNTest.xcworkspace` in Xcode (not `.xcodeproj`).

## Usage

### Calling from React Native

In your React Native code, import the bridge module using `NativeModules`:

```typescript
import { NativeModules, Alert } from 'react-native';

const { RedotpayRNBridge } = NativeModules;

/**
 * Start payment
 * @param preOrderId - Pre-order ID from Create Prepayment Order API https://{environment}/openapi/v1/preOrder/create
 * @param jwtToken - JWT token from Merchant Login API https://{environment}/openapi/v1/merchant/login
 * @param publicKey - Public key
 */
async function startPay(
  preOrderId: string, 
  jwtToken: string, 
  publicKey: string
) {
  try {
    if (!RedotpayRNBridge) {
      Alert.alert('Error', 'RedotPayBridge module not loaded');
      return;
    }

    // Start payment
    RedotpayRNBridge.startPay({
      preOrderId: preOrderId,
      jwtToken: jwtToken,
      publicKey: publicKey,
      language: 'en', // Language code, e.g., 'en', 'zh-Hans', etc.
      isTest: false   // Whether it's a test environment
    })
      .then((result: any) => {
        console.log('Payment started successfully:', result);
        // Handle success case
      })
      .catch((error: any) => {
        console.error('Payment failed to start:', error);
        Alert.alert('Failed', `Payment failed to start: ${error.message || error}`);
      });
  } catch (error: any) {
    Alert.alert('Error', `Payment error: ${error.message || error}`);
  }
}
```

### Complete Example

Refer to the `App.tsx` file in the project, which contains a complete usage example.

## API Reference

### startPay Method

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| preOrderId | string | Yes | Pre-order ID from Create Prepayment Order API |
| jwtToken | string | Yes | JWT token from Merchant Login API |
| publicKey | string | Yes | Public key |
| language | string | Yes | Language code, e.g., 'en', 'zh-Hans', etc. |
| isTest | boolean | Yes | Whether it's a test environment. `true` for test environment, `false` for production environment |

#### Return Value

- **Success**: Promise resolves with `{ success: true }`
- **Failure**: Promise rejects with error information

#### Error Codes

- `INVALID_PARAMS`: Missing required parameters
- `START_PAY_FAILED`: Failed to start payment

## Troubleshooting

### 1. Build Error: RedotPaySDK Not Found

**Solution**:
- Ensure `RedotPaySDK.xcframework` is correctly added to the project
- Check `Framework Search Paths` settings
- Ensure it is set to `Embed & Sign` in `Frameworks, Libraries, and Embedded Content`

### 2. Swift Bridging Error

**Solution**:
- Ensure the `RNTest-Bridging-Header.h` path is correct
- Check the `Objective-C Bridging Header` setting
- Ensure all Swift files are added to the compilation target

### 3. Module Not Loaded Error

**Solution**:
- Ensure `RedotpayRNBridge.m` and `RedotpayRNBridge.swift` are added to the Xcode project
- Check if the files are included in the compilation target
- Clean build cache: `Product -> Clean Build Folder` (Shift + Cmd + K)

### 4. Runtime Crash

**Solution**:
- Ensure you open the project using `.xcworkspace` file, not `.xcodeproj`
- Check if the Framework is correctly embedded (set to `Embed & Sign`)
- Check the detailed error information in the Xcode console

## Project Structure

The project structure after integration should be as follows:

```
ios/
├── RedotPaySDK.xcframework/          # SDK Framework
│   ├── Info.plist
│   ├── ios-arm64/
│   └── ios-arm64_x86_64-simulator/
├── RedotpayRNBridge.m                 # Objective-C Bridge File
├── RedotpayRNBridge.swift             # Swift Bridge Implementation
├── RNTest/
│   ├── RNTest-Bridging-Header.h      # Bridging Header
│   └── ...
└── RNTest.xcworkspace
```

## References

- [RedotPayRNDemo GitHub](https://github.com/xueyuejie/RedotPayRNDemo)
- [React Native Native Modules Documentation](https://reactnative.dev/docs/native-modules-ios)
