// src/hooks/useAuth.ts (hoặc src/context/AuthContext.tsx)
import React, { createContext, useContext, useState, useEffect } from 'react';


// Định nghĩa kiểu cho AuthContextValue
interface AuthContextValue {
  isAuthenticated: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
  // Bạn có thể thêm user info, loading state, v.v. ở đây
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null); // Để lưu token

  // Giả lập kiểm tra token khi khởi động ứng dụng
  useEffect(() => {
    // Trong thực tế, bạn sẽ kiểm tra AsyncStorage hoặc SecureStore ở đây
    const checkToken = async () => {
      // const storedToken = await AsyncStorage.getItem('userToken');
      // if (storedToken) {
      //   setAuthToken(storedToken);
      //   setIsAuthenticated(true);
      // }
      // Tạm thời: sau 1 giây, giả lập là không có token
      setTimeout(() => {
        setIsAuthenticated(false); // Bắt đầu ở trạng thái chưa đăng nhập
      }, 500);
    };
    checkToken();
  }, []);

  const signIn = (token: string) => {
    // Trong thực tế, bạn sẽ lưu token vào AsyncStorage/SecureStore
    // AsyncStorage.setItem('userToken', token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    // Trong thực tế, bạn sẽ xóa token khỏi AsyncStorage/SecureStore
    // AsyncStorage.removeItem('userToken');
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};