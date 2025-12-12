/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  useColorScheme, 
  View, 
  NativeModules, 
  Button,
  Text,
  TextInput,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const { RedotpayRNBridge } = NativeModules;
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function startPay(preOrderId: string, jwtToken: string, publicKey: string) {
  try {
    if (!RedotpayRNBridge) {
      Alert.alert('Error', 'RedotPayBridge module not loaded');
      return;
    }
    RedotpayRNBridge.startPay({
      preOrderId: preOrderId,
      jwtToken: jwtToken,
      publicKey: publicKey,
      language: 'zh-Hans'
    })
      .then((result: any) => {
        console.log('Payment started successfully:', result);
      })
      .catch((error: any) => {
        console.error('Payment failed to start:', error);
        Alert.alert('Failed', `Payment failed to start: ${error.message || error}`);
      });
  } catch (error: any) {
    Alert.alert('Error', `Payment error: ${error.message || error}`);
  }
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [preOrderId, setPreOrderId] = useState('');
  const [jwtToken, setJwtToken] = useState('');
  const [publicKey, setPublicKey] = useState('-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuctrVK3eP8hpoJf7FMetlcR77FYcj9HtrkySyGDRt5HHwdwgM8jK0kfE4ag/zI8goe8M0iJ2o7n3VCfTzn8OyfU0bu6KzDti1WOJV9fv4XtSmhm9W4WKjIc8uDQViR7E8trzcrbKFVbKVGng1+z0KobQBDtWhjUeXKktUq1lpiejTS+XjXej26ANPfwbqbY+/6kBB3sWbt9BLDI/WhPYXnFV9oJWod9I/dYUgUUA/b/+bI1wlobNntBDxiNmX0kbqpGZbzO6l9wWFXZiFCD25QtBOZlMbn9noH4KW3DnKGc2nKNz/f2FEM9DJKn3P7NGFVy6O/Q5NzcbFs+DI6nTywIDAQAB-----END PUBLIC KEY-----');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>preOrderId</Text>
          <TextInput
            style={styles.preSninput}
            value={preOrderId}
            onChangeText={setPreOrderId}
            placeholder="Enter preOrderId"
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>jwtToken</Text>
          <TextInput
            style={styles.jwtTokeninput}
            value={jwtToken}
            onChangeText={setJwtToken}
            placeholder="Enter jwtToken"
            placeholderTextColor="#999"
            multiline
          />
          <Text style={styles.label}>publicKey</Text>
          <TextInput
            style={styles.publicKeyinput}
            value={publicKey}
            onChangeText={setPublicKey}
            placeholder="Enter publicKey"
            placeholderTextColor="#999"
            multiline
          />
          <View style={styles.payButtonContainer}>
            <Button title="PayNow" onPress={() => startPay(preOrderId, jwtToken, publicKey)} />
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    marginTop: 10,
    padding: 16,
    paddingBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  preSninput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  jwtTokeninput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  publicKeyinput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  payButtonContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
});

export default App;
