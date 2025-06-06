/* eslint-disable react-hooks/exhaustive-deps */
// File: src/pages/PostDetail.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PostDetail.css';
import { useLikePost } from './api/use-like-post';
import { useAddComment } from './api/use-add-comment';
import { useFollowUser } from './api/use-follow-user';
import { useGetPosts } from './api/use-get-posts';

// --- Thêm dòng này để import Marked ---
import { marked } from 'marked';
// Hoặc nếu bạn muốn thêm tính năng làm sạch HTML để an toàn hơn (khuyến nghị):
// import DOMPurify from 'dompurify'; // npm install dompurify


const PostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [hasAuthorBeenFollowed, setHasAuthorBeenFollowed] = useState(false);

  const { getPosts } = useGetPosts();
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPosts();
      setAllPosts(posts);
    };
    fetchPosts();
  }, []);

  const { likePost } = useLikePost();
  const { addComment } = useAddComment();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { followUser } = useFollowUser();

  const commentsRef = useRef(null);

  const handleScrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const foundPost = allPosts.find(p => p._id === id);

    if (foundPost) {
      // --- Thay đổi lớn nhất ở đây: Chuyển đổi Markdown thành HTML ---
      const htmlContent = marked.parse(foundPost.content);
      // Nếu dùng DOMPurify để làm sạch HTML (khuyến nghị cho bảo mật XSS):
      // const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);

      setPost({ ...foundPost, content: htmlContent }); // Hoặc sanitizedHtmlContent
      document.title = `${foundPost.title} - Ứng dụng Blog`;

      const postComments = foundPost.comments.map(comment => ({
        _id: comment._id,
        author: { displayName: comment.author.displayName, _id: comment.author._id },
        content: comment.content,
        createdAt: comment.createdAt.split('T')[0]
      }));
      setComments(postComments);

      setLikes(foundPost.likes.length || 0);
      setIsLiked(foundPost.likes.some(like => user && like._id === user._id));
      setHasAuthorBeenFollowed(foundPost.author.followers.some(follower => user && follower === user._id));
    } else {
      setPost(null);
      document.title = 'Bài viết không tìm thấy - Ứng dụng Blog';
    }
  }, [id, allPosts, user._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      if (!user._id) {
        alert('Bạn cần đăng nhập để bình luận.');
        return;
      }

      const commentAuthor = user.displayName;
      const commentAuthorId = user._id;

      const newCommentData = {
        _id: String(Date.now()),
        author: { displayName: commentAuthor, _id: commentAuthorId },
        content: newComment,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setComments(prevComments => [...prevComments, newCommentData]);
      setNewComment('');

      try {
        await addComment(post._id, newCommentData);
      } catch (error) {
        console.error('Error adding comment:', error);
        setComments(prevComments => prevComments.filter(comment => comment._id !== newCommentData._id));
        alert('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.');
      }
    }
  };

  const handleLikePost = async () => {
    if (isLiked || !user._id) {
      if (!user._id) alert('Bạn cần đăng nhập để thích bài viết.');
      return;
    }

    setLikes(prevLikes => prevLikes + 1);
    setIsLiked(true);
    try {
      await likePost(post._id);
    } catch (error) {
      console.error('Error liking post:', error);
      setLikes(prevLikes => prevLikes - 1);
      setIsLiked(false);
      alert('Có lỗi xảy ra khi thích bài viết. Vui lòng thử lại.');
    }
  };

  const handleFollowUser = async () => {
    if (!user._id || post.author._id === user._id) {
        if (!user._id) alert('Bạn cần đăng nhập để theo dõi tác giả.');
        return;
    }

    setHasAuthorBeenFollowed(prev => !prev);

    try {
      await followUser(post.author._id, user._id);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      setHasAuthorBeenFollowed(prev => !prev);
      alert('Có lỗi xảy ra khi theo dõi tác giả. Vui lòng thử lại.');
    }
  };

  if (!post) {
    return <h2 className="post-detail-message">Đang tải bài viết hoặc không tìm thấy...</h2>;
  }

  return (
    <div className="post-detail-wrapper">
      {/* ========== Sidebar bên trái ========= */}
      <div className="sidebar-actions">
        {/* Nút Like bài viết (icon + số) */}
        <button
          className={`like-sidebar-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLikePost}
          disabled={!user._id}
        >
          {isLiked ? '❤️' : '🤍'}
          <span className="like-count">{likes}</span>
        </button>

        {/* Icon Bình luận, click sẽ scroll xuống phần comment */}
        <button
          className="scroll-to-comments-btn"
          onClick={handleScrollToComments}
        >
          💬
        </button>
      </div>

      {/* ========== Phần nội dung chính ========= */}
      <div className="post-detail-container">
        {/* Back button */}
        <button onClick={() => navigate('/home')} className="back-btn">⟵ Quay lại</button>

        {/* Tiêu đề bài viết */}
        <div className="post-detail-header">
          <h1>{post.title}</h1>
        </div>

        {/* Thông tin tác giả và nút Theo dõi */}
        <div className="author-section">
          <div className="author-info">
            {post.author?._id ? (
              <Link to={`/user/${post.author._id}`} className="author-link">
                <strong>{post.author.displayName}</strong>
              </Link>
            ) : (
              <strong>{post.author.displayName || 'Tác giả ẩn danh'}</strong>
            )}
          </div>
          {user._id && post.author._id !== user._id && (
            <button className="follow-btn" onClick={handleFollowUser}>
              {hasAuthorBeenFollowed ? 'Đã theo dõi' : '+ Theo dõi'}
            </button>
          )}
        </div>

        {/* Ảnh chính của bài viết (nếu có) */}
        {post.bookImage && (
          <img
            src={post.bookImage}
            alt={post.title}
            className="post-main-image"
          />
        )}

        {/* Nội dung bài viết */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>

        {/* ========== Phần bình luận ========= */}
        <div className="comments-section" ref={commentsRef}>
          <h3>Bình luận</h3>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder={user._id ? "Viết bình luận của bạn..." : "Đăng nhập để bình luận..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              disabled={!user._id}
            ></textarea>
            <button type="submit" disabled={!user._id}>Gửi bình luận</button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-main-content">
                    {comment.author?._id ? (
                      <Link to={`/user/${comment.author._id}`} className="comment-author-link" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <p className="comment-author"><strong>{comment.author.displayName}</strong></p>
                        <p style={{ color: '#666', fontSize: '12px' }}> - {comment.createdAt}</p>
                      </Link>
                    ) : (
                      <p className="comment-author"><strong>{comment.author.displayName || 'Người dùng ẩn danh'}</strong></p>
                    )}
                    <p className="comment-text">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* ========== Kết thúc phần bình luận ========== */}
      </div>
      {/* ========== Kết thúc nội dung chính ========== */}
    </div>
  );
};

export default PostDetail;