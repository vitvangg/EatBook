// File: src/components/header-main.jsx

import React, { useState, useRef, useEffect } from 'react';
import './header-main.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../store/users';

function HeaderMain() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleAvatarClick = () => setShowMenu((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (user?._id) navigate(`/user/${user._id}`);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <header className="header-main">
      <div className="header-left">
        <img
          src="/logo.png"
          alt="Logo"
          className="logo"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        />
        <span
          className="brand-name"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          Cookbook
        </span>
      </div>

      <div className="header-buttons">
        <button className="nav-btn contact-btn" onClick={() => navigate('/contact')}>📞 Liên hệ</button>
        <button className="nav-btn" onClick={() => navigate('/about-us')}>ℹ️ About Us</button>
        <button className="nav-btn write-btn" onClick={() => window.open('/write', '_blank')}>✏️ Viết bài</button>

        {user ? (
          <div className="user-menu-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={handleAvatarClick}
              style={{ borderRadius: '50px', display: 'flex', alignItems: 'center' }}
            >
              <img
                src={user.avatarUrl || "/default-avatar.png"}
                alt="Avatar"
                className="avatar"
                style={{ width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer' }}
              />
            </button>
            <div
              className={`dropdown-menu${showMenu ? ' active' : ''}`}
              ref={menuRef}
              style={{ display: showMenu ? 'block' : 'none', position: 'absolute', right: 0, top: '60px', zIndex: 1000 }}
            >
              <button className="dropdown-item" onClick={handleProfileClick}>
                Xem trang cá nhân
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <button className="nav-btn" onClick={() => navigate('/login')}>
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}

export default HeaderMain;
