// src/screens/app/ReviewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ReviewScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Viết bài đăng mới</Text>
      <Text style={styles.subtitle}>Đây là nơi bạn có thể chia sẻ công thức của mình.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});