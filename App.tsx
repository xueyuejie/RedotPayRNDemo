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
  Alert,
  Text,
  TextInput,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const { RedotpayRNBridge } = NativeModules;
const testPublicKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuctrVK3eP8hpoJf7FMetlcR77FYcj9HtrkySyGDRt5HHwdwgM8jK0kfE4ag/zI8goe8M0iJ2o7n3VCfTzn8OyfU0bu6KzDti1WOJV9fv4XtSmhm9W4WKjIc8uDQViR7E8trzcrbKFVbKVGng1+z0KobQBDtWhjUeXKktUq1lpiejTS+XjXej26ANPfwbqbY+/6kBB3sWbt9BLDI/WhPYXnFV9oJWod9I/dYUgUUA/b/+bI1wlobNntBDxiNmX0kbqpGZbzO6l9wWFXZiFCD25QtBOZlMbn9noH4KW3DnKGc2nKNz/f2FEM9DJKn3P7NGFVy6O/Q5NzcbFs+DI6nTywIDAQAB-----END PUBLIC KEY-----';
const publicKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzMn4r06M/cp2amkbCxIsPSr030JoCFeymwjTZrBnI8kW4mtL6JtUPYpJTFgCB8ZQoV75lEmUw8gSLbN770Cc5EOi1dF4ekmLQ7Ez0SFUbQgJa7Vg5wBdSKcbUmkKGviJt+iZRJ0tZsPpXMPqIo9YOWJagfPbDhEwT2t1ANP4ou98sCqLqELI80iYm8+W4B9IvBW4lc+H5BAPtXpYMtlZ6stCnvHXd1EjvlTak25v5xJ8AInEeAy8/D2glunmz/VfPyoB5OHPgnYVU66HyeQcO1ZY/jzB5d6I/zX4JENG1xrP8ThPZ9qMWtmputJ0XYKymiZgZP6vh0L+G6P/Z98vlQIDAQAB-----END PUBLIC KEY-----';
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

/**
 * Start payment
 * @param jwtToken - JWT token from Merchant Login https://{environment}/openapi/v1/merchant/login
 * @param preOrderId - Preorder ID from Create Prepayment Order https://{environment}/openapi/v1/preOrder/create
 * @param publicKey - Public key frome 
 */
async function startPay(preOrderId: string, jwtToken: string, publicKey: string) {
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
      language: 'en',
      isTest: false
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
  const [preOrderId, setPreOrderId] = useState('');
  const [jwtToken, setJwtToken] = useState('');
  const [publicKeyString, setPublicKeyString] = useState(publicKey);
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
            placeholder="From Create Prepayment Order"
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>jwtToken</Text>
          <TextInput
            style={styles.jwtTokeninput}
            value={jwtToken}
            onChangeText={setJwtToken}
            placeholder="From Merchant Login"
            placeholderTextColor="#999"
            multiline
          />
          <Text style={styles.label}>publicKey</Text>
          <TextInput
            style={styles.publicKeyinput}
            value={publicKey}
            onChangeText={setPublicKeyString}
            placeholder="Enter publicKey"
            placeholderTextColor="#999"
            multiline
          />
          <View style={styles.payButtonContainer}>
            <Button title="PayNow" onPress={() => startPay(preOrderId, jwtToken, publicKeyString)} />
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
    flex: 1,
    minHeight: 150,
  },
});

export default App;
