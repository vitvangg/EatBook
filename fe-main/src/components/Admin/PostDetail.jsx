import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { usePost } from '../../store/posts';
import { useComment } from '../../store/comments';
import { useUser } from '../../store/users';
import { useNotification } from '../../contexts/NotificationContext';
import { marked } from 'marked';
import { BsHeart, BsChatLeftText } from "react-icons/bs";

const PostDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const { detailPost } = usePost();
  const { listCommentByPost, addComment } = useComment();
  const { user } = useUser();
  const { showNotification } = useNotification ? useNotification() : { showNotification: (msg) => alert(msg) };

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const commentFormRef = useRef(null);

  useEffect(() => {
    detailPost(id)
      .then(setPost)
      .catch(() => setPost(null));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    listCommentByPost(id)
      .then(setComments)
      .catch(() => setComments([]));
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    // Nếu là admin, chỉ hiện thông báo đỏ, không gọi API, không showNotification lỗi
    if (user?.role === 'admin') return;

    setLoadingComment(true);
    try {
      await addComment(id, commentContent);
      setCommentContent('');
      const newComments = await listCommentByPost(id);
      setComments(newComments);
      setPost(await detailPost(id));
      showNotification('Bình luận thành công!', 'success');
    } catch (err) {
      showNotification('Có lỗi khi gửi bình luận!', 'error');
    } finally {
      setLoadingComment(false);
    }
  };

  // Hàm lấy URL ảnh sách
  const getImageUrl = (post) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (post.bookImage) {
      console.log(`${backendUrl}${post.bookImage}`);
      return `${backendUrl}${post.bookImage}`;
    }
    return null;
  };

  if (!post) return <div className="text-center mt-5">Không tìm thấy bài viết.</div>;

  const backTo = location.state?.backTo || '/'; // fallback nếu không có

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 mb-3">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(backTo)}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="row justify-content-center align-items-start">
        <div
          className="col-md-1 d-none d-md-flex flex-column align-items-center gap-3"
          style={{ position: 'sticky', top: 100, height: 'fit-content', zIndex: 2 }}
        >
          <button className="btn btn-outline-danger d-flex flex-column align-items-center">
            <BsHeart size={22} />
            <span>{post.likes.length}</span>
          </button>
          <button
            className="btn btn-outline-primary d-flex flex-column align-items-center"
            onClick={() => {
              commentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => {
                commentFormRef.current?.querySelector('textarea')?.focus();
              }, 400);
            }}
          >
            <BsChatLeftText size={22} />
            <span>{post.comments.length}</span>
          </button>
        </div>

        <div className="col-lg-8 col-md-10 col-12 mx-auto">
          <h2 className="fw-bold mb-2 text-center">{post.title}</h2>
          <div className="mb-2 text-muted d-flex align-items-center justify-content-center">
            <img src={post.author.avatarUrl} alt="" width={32} height={32} className="rounded-circle me-2" />
            <span>{post.author.displayName}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="mb-3 text-center">
            {post.tags.map((tag, i) => (
              <span key={i} className="badge bg-secondary me-2">{tag}</span>
            ))}
          </div>
          {post.bookImage && (
            <img
              src={getImageUrl(post)}
              alt={post.bookName}
              className="img-fluid rounded mb-3 d-block mx-auto"
              style={{ maxWidth: 350 }}
            />
          )}
          <div className="mb-4 text-center">
            <strong>Sách:</strong> {post.bookName}
          </div>
          <div
            className="mb-5"
            style={{ fontSize: '1.1rem', background: '#fafbfc', borderRadius: 8, padding: 24 }}
            dangerouslySetInnerHTML={{ __html: marked.parse(post.content || '') }}
          />
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 col-md-10 col-12 mx-auto">
          <h5 className="mb-3">Bình luận</h5>
          {comments.length > 0 ? (
            <div className="mb-4">
              {comments.map((cmt) => (
                <div key={cmt._id} className="d-flex align-items-start mb-3">
                  <img
                    src={cmt.author?.avatarUrl || 'https://cdn.imgbin.com/2/22/0/imgbin-computer-icons-monkey-animal-monkey-3zRxzh84tPF4FESfm4P9qC7uA.jpg'}
                    alt={cmt.author?.displayName || 'User'}
                    className="rounded-circle me-2"
                    width={32}
                    height={32}
                  />
                  <div>
                    <div className="fw-bold">{cmt.author?.displayName || 'User'}</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{cmt.content}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted mb-4">Chưa có bình luận nào.</div>
          )}

          <form
            ref={commentFormRef}
            onSubmit={handleAddComment}
            className="d-flex align-items-start gap-2"
          >
            <img
              src={post.author?.avatarUrl || 'https://via.placeholder.com/32'}
              alt="avatar"
              className="rounded-circle"
              width={32}
              height={32}
            />
            <div className="flex-grow-1">
              <textarea
                className="form-control"
                rows={2}
                placeholder="Viết bình luận..."
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                style={{ resize: 'none' }}
                disabled={loadingComment || user?.role === 'admin'}
              />
              {user?.role === 'admin' && (
                <div className="text-danger mt-1" style={{ fontSize: '0.95em' }}>
                  Admin không thể bình luận!
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loadingComment || !commentContent.trim() || user?.role === 'admin'}
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
