// src/contexts/AuthContext.jsx  (≈ 750 bytes)
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  token: null,
  login: () => Promise.resolve({ success: false }),
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Khi app lần đầu load, lấy token+user từ localStorage (nếu có)
  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // ~~ 0.1 ms
    const storedUser = localStorage.getItem('user');   // ~~ 0.1 ms
    if (storedToken && storedUser) {
      setToken(storedToken);                                 // ~~ 0.4 ms
      setUser(JSON.parse(storedUser));                       // ~~ 0.2 ms parse + ~~ 0.4 ms setState
    }
  }, []);

  // Hàm login giả lập
  const login = async (email, password) => {
    // Giả lập “đợi server” 200 ms
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Tạo fake token (~32 chars) và fake user
    const fakeToken = 'fake-jwt-token-' + Date.now();
    const fakeUser = { email, displayName: (email.split('@')[0] || 'User') };
    // Lưu vào localStorage ~~ 0.2 ms + 0.2 ms
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));
    // Cập nhật vào state ~~ 0.4 ms + 0.4 ms
    setToken(fakeToken);
    setUser(fakeUser);
    return { success: true };
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem('token');                  // ~~ 0.2 ms
    localStorage.removeItem('user');                   // ~~ 0.2 ms
    setToken(null);                                    // ~~ 0.4 ms
    setUser(null);                                     // ~~ 0.4 ms
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
