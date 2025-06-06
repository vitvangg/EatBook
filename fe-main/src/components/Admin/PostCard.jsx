import React, { useState } from 'react';
import { BsHeart, BsChatLeftText } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../store/posts";
import { useNotification } from '../../contexts/NotificationContext';

function PostCard({ post, pagination, onError, onSuccess }) {
    const navigate = useNavigate();
    const { deletePost } = usePost();
    const { showNotification } = useNotification();
    const [showConfirm, setShowConfirm] = useState(false);

    const getImageUrl = (post) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (post.bookImage) {
            console.log(`${backendUrl}${post.bookImage}`)
            return `${backendUrl}${post.bookImage}`;
        }
        else {
            console.log(`${backendUrl}${post.bookImage}`)
        }
        // Default image dựa trên category/tag
        const defaultImages = {
            'Art & Photography': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop',
            'Business & Economics': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
            'Cookbooks & Food': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
            'Education & Teaching': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
            'History & Politics': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
            'Science & Technology': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        };

        const category = post.tags && post.tags[0];
        return defaultImages[category] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
    };

    // Format ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDelete = async () => {
        setShowConfirm(false);
        try {
            await deletePost(post._id || post.id);
            showNotification("Xóa thành công!", "success");
            if (onSuccess) onSuccess("Xóa thành công!");
        } catch (err) {
            showNotification("Xóa thất bại: " + err.message, "danger");
            if (onError) onError("Xóa thất bại: " + err.message);
        }
    };

    return (
        <div className="card h-100 shadow-sm border-0">
            <div className="position-relative">
                <img
                    src={getImageUrl(post)}
                    className="card-img-top"
                    alt={post.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
                    }}
                />
                {post.tags && post.tags.length > 0 && (
                    <span className="badge bg-primary position-absolute top-0 start-0 m-2">
                        {post.tags[0]}
                    </span>
                )}
            </div>

            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold mb-2" style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {post.title}
                </h5>

                {post.bookName && (
                    <div className="mb-2">
                        <small className="text-muted">
                            <i className="fas fa-book me-1"></i>
                            Sách: <strong>{post.bookName}</strong>
                        </small>
                    </div>
                )}

                <div className="mt-auto">
                    <div className="d-flex align-items-center mb-2">
                        <img
                            src={post.author?.avatarUrl || 'https://via.placeholder.com/32'}
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                            alt={post.author?.displayName || 'Author'}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/32';
                            }}
                        />
                        <div>
                            <div className="fw-medium" style={{ fontSize: '0.9rem' }}>
                                {post.author?.displayName || 'Unknown Author'}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-muted">
                        <small>{formatDate(post.createdAt)}</small>
                        <div className="d-flex gap-3">
                            <small>
                                <BsHeart className="me-1" />
                                {post.likes?.length || 0}
                            </small>
                            <small>
                                <BsChatLeftText className="me-1" />
                                {post.comments?.length || 0}
                            </small>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(
                                `/admin/posts/${post._id || post.id}?page=${pagination?.currentPage || 1}`,
                                { state: { backTo: `/admin/posts?page=${pagination?.currentPage || 1}` } }
                            )}
                        >
                            View
                        </button>
                        <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => navigate(`/admin/post/edit/${post._id || post.id}`)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setShowConfirm(true)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Bootstrap Modal xác nhận xóa */}
            {
                showConfirm && (
                    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.2)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Xác nhận xóa</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
                                </div>
                                <div className="modal-body">
                                    Bạn có chắc chắn muốn xóa bài viết "<strong>{post.title}</strong>"?
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary btn-sm" onClick={() => setShowConfirm(false)}>
                                        Hủy
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default PostCard;