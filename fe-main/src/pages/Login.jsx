import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useUser } from '../store/users'; // Import useUser hook
import './Login.css';

const Login = () => {
  useEffect(() => {
    document.title = 'Đăng nhập - CookBook';
  }, []);

  const navigate = useNavigate();
  const { setUser } = useUser(); // Get setUser from store
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await loginUser(email, password);

      if (res.success && res.userData) {
        const user = res.userData;

        // Lưu user vào localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Cập nhật user trong store (nếu bạn đang dùng store)
        if (setUser) {
          setUser(user);
        }

        // Hiển thị thông báo thành công
        alert(res.message);

        // Điều hướng dựa trên role
        if (user.role === 'admin') {
          navigate('/admin/overview');
        } else {
          navigate('/home');
        }
      } else {
        setError(res.message || 'Đăng nhập không thành công');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Lỗi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="left-panel">
        <img src="/MyLoginGif.gif" alt="Login GIF" />
      </div>
      <div className="right-panel">
        <form className="login-form" onSubmit={handleLogin}>
          <img src="/logo.png" alt="Logo" className="form-logo" />
          <h2>Đăng Nhập</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <label>Email:</label>
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <label>Password:</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;