// src/screens/app/ArticleScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ArticleScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Các Chủ đề công thức</Text>
      <Text style={styles.subtitle}>Lọc và khám phá các công thức theo chủ đề.</Text>
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