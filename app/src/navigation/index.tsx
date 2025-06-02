// src/navigation/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuth } from '../hooks/useAuth'; // Import useAuth

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated } = useAuth(); // Lấy trạng thái đăng nhập từ context

  console.log('RootNavigator isAuthenticated:', isAuthenticated); // Để debug

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="App" component={AppNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}