// File: src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Main Components
import HeaderMain from './components/header-main';
import HeadAdmin from './components/Admin/AdminHeader';

// User Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import UserProfile from './pages/UserProfile';
import WritePost from './pages/WritePost';
import EditProfile from './pages/EditProfile';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';

// Admin Pages
import CommentPage from './pages/Admin/CommentPage';
import UserPage from './pages/Admin/UserPage';
import OverviewPage from './pages/Admin/OverviewPage';
import PostPage from './pages/Admin/PostPage';
import ContactPage from './pages/Admin/ContactPage';
import AdminPostDetail from './components/Admin/PostDetail';
import UpdatePostCard from './components/Admin/UpdatePostCard';

// Context and Store
import { NotificationProvider } from './contexts/NotificationContext';
import { useUser } from './store/users';

// App Router Component
function AppRouter() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const { user } = useUser();

  // Determine which header to show
  let header = null;
  if (!isLogin) {
    if (user?.role === 'admin') {
      header = <HeadAdmin />;
    } else if (user) {
      header = <HeaderMain />;
    }
  }

  return (
    <>
      {header}
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* User Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/write" element={<WritePost />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about-us" element={<AboutUs />} />

        {/* Admin Routes */}
        <Route path="/admin/overview" element={<OverviewPage />} />
        <Route path="/admin/users" element={<UserPage />} />
        <Route path="/admin/posts" element={<PostPage />} />
        <Route path="/admin/post/edit/:id" element={<UpdatePostCard />} />
        <Route path="/admin/posts/:id" element={<AdminPostDetail />} />
        <Route path="/admin/comments" element={<CommentPage />} />
        <Route path="/admin/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <NotificationProvider>
      <Router>
        <AppRouter />
      </Router>
    </NotificationProvider>
  );
}

export default App;
