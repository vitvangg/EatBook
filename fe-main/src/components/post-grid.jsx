import React from 'react';
import { Link } from 'react-router-dom';
import './post-grid.css'; // Đảm bảo file CSS tồn tại với tên này

// Nhận thêm prop selectedCategory
const PostGrid = ({ posts, searchTerm, selectedCategory }) => {
  // Nếu posts không được cung cấp, mặc định là mảng rỗng để tránh lỗi
  const displayPosts = posts || [];

  // Lọc bài viết dựa trên searchTerm và selectedCategory
  const filteredPosts = displayPosts.filter(post => {
    // 1) matchSearch: title hoặc author chứa searchTerm (không phân biệt hoa-thường)
    const matchSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.displayName.toLowerCase().includes(searchTerm.toLowerCase());

    // 2) matchCategory:
    // Nếu selectedCategory === 'All', hiển thị tất cả bài → matchCategory = true
    // Ngược lại, post.tags phải là mảng và chứa selectedCategory
    const matchCategory =
      selectedCategory === 'All' ||
      (Array.isArray(post.tags) && post.tags.includes(selectedCategory));

    // Kết hợp hai điều kiện
    return matchSearch && matchCategory;
  });

  return (
    <section className="post-grid-section">
      <h2>Bài viết nổi bật</h2>
      <div className="grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Link to={`/post/${post._id}`} key={post._id} className="post-card-item">
              <img
                src={post.bookImage ?? (post.images.length > 0 ? post.images[0] : '')}
                alt={post.title}
                className="post-card-image"
              />
              <div className="post-card-info">
                <p className="post-card-time">{post.createdAt.split('T')[0]}</p>
                <h3 className="post-card-title">{post.title}</h3>
                <p className="post-card-author">{post.author.displayName}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-results-message">Không tìm thấy bài viết nào phù hợp.</p>
        )}
      </div>
    </section>
  );
};

export default PostGrid;
