/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserProfile.css';
import { useGetUser } from './api/use-get-user';

const UserProfile = () => {
  const { id } = useParams(); // Lấy id người dùng từ URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { getUser } = useGetUser()

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser(id)
      setUser(data.data)
    }
    fetchUserData()
  }, [id])

  if (!user) return <div className="loading-state">Đang tải hồ sơ...</div>; // Chờ khi dữ liệu đang được tải

  return (
    <div className="user-profile-container">
      <div className="user-header-banner" style={{ backgroundImage: `url(${user.backgroundUrl})` }}>
        <img src={user.avatarUrl} alt={user.displayName} className="user-avatar-large" />
      </div>

      <div className="user-info-section">
        <div className="user-main-details" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2>{user.displayName}</h2>
          <p className="user-handle">{user.email}</p>  {/* Hiển thị email */}
          <p className="user-job">{user.bio.job|| 'Chưa cập nhật việc làm'}</p>
          <p className="user-education">{user.bio.education|| 'Chưa cập nhật thông tin học vấn'}</p>
          <p className="user-current-places">{user.bio.currentPlaces.join(', ')|| 'Chưa cập nhật thông tin'}</p>
        </div>

        <div className="user-actions">
          <button
            className="edit-profile-btn"
            onClick={() => navigate('/edit-profile/')}
          >
            Chỉnh sửa trang cá nhân
          </button>
          <button
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={() => setIsFollowing(!isFollowing)}  // Toggle follow state
          >
            {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
          </button>
        </div>
      </div>

      {/* Nội dung bài viết, series, lưu trữ, etc. */}
    </div>
  );
};

export default UserProfile;

