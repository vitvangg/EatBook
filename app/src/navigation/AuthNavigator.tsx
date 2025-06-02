// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen'; // Import SignUpScreen

// Định nghĩa kiểu cho các route trong AuthStack
type AuthStackParamList = {
  SignIn: undefined; // 'undefined' nghĩa là route này không nhận params
  SignUp: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} /> 
    </AuthStack.Navigator>
  );
}