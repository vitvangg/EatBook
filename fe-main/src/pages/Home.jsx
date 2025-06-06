/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar.jsx';           // Đường dẫn đúng tới navbar.jsx
import SearchBar from '../components/search-bar.jsx';    // Đường dẫn đúng tới search-bar.jsx
import PostGrid from '../components/post-grid.jsx';      // Đường dẫn đúng tới post-grid.jsx
import AdPopup from '../components/AdPopup';             // Giữ nguyên nếu bạn có component này
import { getCookie, setCookie } from '../utils/cookie.js'; // Helpers thao tác cookie
import { useGetPosts } from './api/use-get-posts.js';    // Đường dẫn đúng tới hook useGetPosts

const Home = () => {
  // ─────────────────── 1. Khai báo state ───────────────────
  const [searchTerm, setSearchTerm] = useState('');                // Dòng 8
  const [allPosts, setAllPosts] = useState([]);                    // Dòng 9
  const [selectedCategory, setSelectedCategory] = useState('All'); // Dòng 10: mặc định chọn “All”
  const { getPosts } = useGetPosts();                              // Dòng 11

  // Trạng thái quản lý popup
  const [isPopupVisible, setIsPopupVisible] = useState(false);     // Dòng 13

  // ─────────────────── 2. Lấy bài viết & kiểm tra cookie popup ───────────────────
  useEffect(() => {
    // 2.1. Lấy danh sách bài viết từ API
    const fetchPosts = async () => {
      const posts = await getPosts();
      setAllPosts(posts);
    };
    fetchPosts();

    // 2.2. Kiểm tra cookie 'ad_popup_closed'
    const hasClosed = getCookie('ad_popup_closed');
    if (!hasClosed) {
      // Nếu chưa có cookie, chờ 30s rồi hiển thị popup
      const timerId = setTimeout(() => {
        setIsPopupVisible(true);
      }, 30000); // 30_000ms = 30s

      // Cleanup nếu component unmount trước khi 30s kết thúc
      return () => clearTimeout(timerId);
    }
    // Nếu cookie đã có, bỏ qua hiển thị popup
  }, []);

  // ─────────────────── 3. Hàm đóng popup ───────────────────
  const handleClosePopup = () => {
    setIsPopupVisible(false);
    // Lưu cookie 'ad_popup_closed' = true, tồn tại 7 ngày (604800 giây)
    setCookie('ad_popup_closed', 'true', 604800);
  };

  // ─────────────────── 4. Render UI ───────────────────
  return (
    <>
      {/* 4.1. Thanh điều hướng: truyền selectedCategory + setSelectedCategory */}
      <Navbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 4.2. Thanh tìm kiếm */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 4.3. Lưới bài viết: thêm prop selectedCategory để filter */}
      <PostGrid
        posts={allPosts}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
      />

      {/* 4.4. Popup quảng cáo */}
      <AdPopup
        visible={isPopupVisible}
        onClose={handleClosePopup}
      />
    </>
  );
};

export default Home;
