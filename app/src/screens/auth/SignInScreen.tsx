// src/screens/auth/SignInScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';

const { width, height } = Dimensions.get('window');

const logo = require('../../../assets/images/logo.png'); 

export default function SignInScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { signIn } = useAuth();

  const handleSignIn = () => {
    const dummyToken = 'your_dummy_auth_token';
    console.log("Simulating sign-in with dummy token.");
    signIn(dummyToken);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topSection}>
        <Image source={logo} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.appName}>CookBook</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.emailLabel}>Your email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.passwordLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••••"
          secureTextEntry
          placeholderTextColor="#A0A0A0"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={styles.text}>
            Haven't got any account?{' '}
            <Text onPress={() => navigation.navigate('SignUp')} style={styles.link}>
              Sign up here
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCD5CE', 
  },
  topSection: {
    height: height * 0.35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 20,
    backgroundColor: '#FCD5CE', 
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50, 
    overflow: 'hidden', 
  },
  headerLogo: { 
    width: width * 0.3, 
    height: width * 0.3,
    marginBottom: 20, 
  },
  appName: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 10, 
  },
  contentBox: {
    flex: 1,
    backgroundColor: '#FFF0F1', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    marginTop: -30, 
    paddingHorizontal: width * 0.08, 
    paddingVertical: 30,
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 }, 
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  emailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 20, 
  },
  passwordLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 20, 
  },
  input: {
    width: '100%',
    height: 45, 
    borderBottomWidth: 2, 
    borderBottomColor: '#000', 
    paddingHorizontal: 0, 
    paddingBottom: 5, 
    fontSize: 16,
    color: '#333',
    marginBottom: 20, 
  },
  button: {
    width: '100%',
    backgroundColor: '#FC5C65', 
    padding: 15,
    borderRadius: 25, 
    alignItems: 'center',
    marginTop: 30, 
    shadowColor: '#FC5C65', 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 30, 
    width: '100%',
    justifyContent: 'center', 
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  link: {
    fontSize: 16,
    color: '#FC5C65', 
    fontWeight: 'bold',
  },
});