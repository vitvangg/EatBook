// src/screens/app/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Không cần navigation để signOut
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth

export default function HomeScreen() {
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to CookBook!</Text>
        <Text style={styles.subtitle}>The finest book reviewing experience you'll ever get!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});