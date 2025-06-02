// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from '../screens/app/HomeScreen';
import ReviewScreen from '../screens/app/ReviewScreen';
import ArticleScreen from '../screens/app/ArticleScreen';
import NotificationsScreen from '../screens/app/NotificationsScreen';
import { useAuth } from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const logo = require('../../assets/images/logo.png');

// Custom Header Component (không thay đổi so với lần trước)
function CustomHeader({ navigation }) {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <View style={[headerStyles.headerContainer, { paddingTop: insets.top }]}>
      {/* Left Section: Logo and App Name */}
      <View style={headerStyles.leftSection}>
        <Image source={logo} style={headerStyles.headerLogo} resizeMode="contain" />
        <Text style={headerStyles.appName}>CookBook</Text>
      </View>

      {/* Center Section: Sign Out Button */}
      <TouchableOpacity style={headerStyles.signOutButton} onPress={handleSignOut}>
        <Text style={headerStyles.signOutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>

      {/* Right Section: Search and User Icons */}
      <View style={headerStyles.rightSection}>
        <TouchableOpacity style={headerStyles.iconButton}>
          <FontAwesome size={24} name="search" color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={headerStyles.iconButton}>
          <FontAwesome size={24} name="user-circle" color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppNavigator() {
  const insets = useSafeAreaInsets(); // Lấy insets cho tab bar

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#FC5C65',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          // Tăng chiều cao và paddingBottom để đẩy thanh tab lên trên thanh điều hướng
          height: 60 + insets.bottom, // Chiều cao cơ bản + padding của vùng an toàn dưới cùng
          paddingBottom: insets.bottom, // Áp dụng padding dưới cùng
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        header: (props) => <CustomHeader {...props} />,
      })}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />

      {/* Review Tab */}
      <Tab.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          title: 'Viết bài',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="pencil-square-o" color={color} />,
        }}
      />

      {/* Article Tab (Chủ đề/Danh mục) */}
      <Tab.Screen
        name="Article"
        component={ArticleScreen}
        options={{
          title: 'Chủ đề',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="th-list" color={color} />,
        }}
      />

      {/* Notifications Tab */}
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="bell" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: 90,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#FC5C65',
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
});
